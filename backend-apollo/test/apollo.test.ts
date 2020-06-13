import { PrismaClient } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { Redis as RedisClient } from "ioredis";
import type { Context } from "koa";
import { gql } from "apollo-server-koa";
import type { ApolloServerBase } from "apollo-server-core";
import { createTestClient } from "apollo-server-testing";

import type { WrContext } from "../src/types";
import { getClaims } from "../src/util";
import { createApollo } from "../src/apollo";

let prisma: PrismaClient;
let redisClient: RedisClient;
let pubsub: RedisPubSub;
let baseCtx: WrContext;

beforeAll(() => {
  prisma = new PrismaClient();
  redisClient = new Redis();
  pubsub = new RedisPubSub();
  baseCtx = { prisma, fetchDepth: 3, pubsub, redisClient };
});

afterAll(async () => {
  pubsub.close();
  await redisClient.quit();
  await prisma.disconnect();
});

describe("server", () => {
  const email = "abs@xyz.com";
  const token = "not_used";
  const authorizer = "DEVELOPMENT";
  const identifier = "password";
  const name = "deck name";
  let jwt = "Bearer ";
  beforeEach(async () => {
    await prisma.subdeck.deleteMany({});
    await prisma.occupant.deleteMany({});
    await prisma.chatMsg.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.card.deleteMany({});
    await prisma.deck.deleteMany({});
    await prisma.user.deleteMany({});
  });
  afterEach(async () => {
    await prisma.subdeck.deleteMany({});
    await prisma.occupant.deleteMany({});
    await prisma.chatMsg.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.card.deleteMany({});
    await prisma.deck.deleteMany({});
    await prisma.user.deleteMany({});
  });
  async function userTest() {
    const apollo = createApollo((_ctx) => ({
      ...baseCtx,
      // https://github.com/apollographql/apollo-server/issues/1140#issuecomment-641914963
    })) as unknown as ApolloServerBase;
    try {
      const { mutate } = createTestClient(apollo);
      const res = await mutate({
        mutation: gql`
          mutation CreateUser($email: String! $token: String! $authorizer: String! $identifier: String!) {
            signin(email: $email token: $token authorizer: $authorizer identifier: $identifier) {
              token
            }
          }
        `,
        variables: { email, token, authorizer, identifier },
      });
      expect(res).toHaveProperty("data.signin.token");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jwt = `Bearer ${res.data?.signin?.token as string}`;
      expect(getClaims({
        ctx: {
          get: (headerKey: string) => headerKey === "Authorization" ? jwt : undefined,
        } as unknown as Context,
      })).toEqual(expect.objectContaining({
        email,
        roles: ["user"],
      }));
    } finally {
      await apollo.stop();
    }
  }
  test("it creates and returns a user with the appropriate mutations and queries", async () => {
    expect.assertions(2);
    await userTest();
  }, 10000);
  async function deckTest() {
    await userTest();
    if (typeof jwt !== "string") {
      return;
    }
    const sub = getClaims({ ctx: {
      get: (headerKey: string) => headerKey === "Authorization" ? jwt : undefined,
    } as unknown as Context });
    const apollo = createApollo((_ctx) => ({
      ...baseCtx,
      sub,
      // https://github.com/apollographql/apollo-server/issues/1140#issuecomment-641914963
    })) as unknown as ApolloServerBase;
    try {
      const { mutate } = createTestClient(apollo);
      const res = await mutate({
        mutation: gql`
          mutation CreateDeck($name: String!) {
            deckCreate(name: $name) {
              name
            }
          }
        `,
        variables: { name },
      });
      expect(res).toHaveProperty("data.deckCreate.name", name);
    } finally {
      await apollo.stop();
    }
  }
  test("it creates a user and deck with the appropriate mutations and queries", async () => {
    expect.assertions(3);
    await deckTest();
  }, 15000);
  // test("it creates a user, deck, card, room, chatMsg with the appropriate mutations and queries", userTest);

});
