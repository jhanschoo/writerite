import { PrismaClient } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";
import type { Context } from "koa";
import { gql } from "apollo-server-koa";
import type { ApolloServerBase } from "apollo-server-core";
import { createTestClient } from "apollo-server-testing";

import type { WrContext } from "../src/types";
import { getClaims } from "../src/util";
import { createApollo } from "../src/apollo";

import { cascadingDelete } from "./testUtil";

let prisma: PrismaClient;
let pubsub: RedisPubSub;
let baseCtx: WrContext;

beforeAll(() => {
  prisma = new PrismaClient();
  pubsub = new RedisPubSub();
  baseCtx = { prisma, fetchDepth: 3, pubsub };
});

afterAll(async () => {
  await cascadingDelete(prisma).user;
  await Promise.all([pubsub.close(), prisma.$disconnect()]);
});

describe("server", () => {
  const email = "abs@xyz.com";
  const token = "not_used";
  const authorizer = "DEVELOPMENT";
  const identifier = "password";
  const name = "deck name";
  const description = { foo: "bar" };
  let jwt = "Bearer ";
  beforeEach(() => cascadingDelete(prisma).user);
  async function userTest() {
    const apollo = createApollo((_ctx) => ({
      ...baseCtx,
      // https://github.com/apollographql/apollo-server/issues/1140#issuecomment-641914963
    })) as unknown as ApolloServerBase;
    try {
      const { mutate } = createTestClient(apollo);
      const res = await mutate({
        mutation: gql`
          mutation CreateUser(
            $email: String!
            $token: String!
            $authorizer: String!
            $identifier: String!
          ) {
            signin(
              email: $email
              token: $token
              authorizer: $authorizer
              identifier: $identifier
            ) {
              token
            }
          }
        `,
        variables: { email, token, authorizer, identifier },
      });
      expect(res).toHaveProperty("data.signin.token");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jwt = `Bearer ${res.data?.signin?.token as string}`;
      expect(
        getClaims({
          ctx: {
            get: (headerKey: string) =>
              headerKey === "Authorization" ? jwt : undefined,
          } as unknown as Context,
        })
      ).toEqual(
        expect.objectContaining({
          email,
          roles: ["user"],
        })
      );
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
    const sub = getClaims({
      ctx: {
        get: (headerKey: string) =>
          headerKey === "Authorization" ? jwt : undefined,
      } as unknown as Context,
    });
    const apollo = createApollo((_ctx) => ({
      ...baseCtx,
      sub,
      // https://github.com/apollographql/apollo-server/issues/1140#issuecomment-641914963
    })) as unknown as ApolloServerBase;
    try {
      const { mutate } = createTestClient(apollo);
      const res = await mutate({
        mutation: gql`
          mutation CreateDeck($name: String!, $description: JSONObject!) {
            deckCreate(name: $name, description: $description) {
              name
              description
              editedAt
            }
          }
        `,
        variables: { name, description },
      });
      expect(res).toHaveProperty("data.deckCreate.name", name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res).toHaveProperty("data.deckCreate.description", description);
    } finally {
      await apollo.stop();
    }
  }
  test("it creates a user and deck with the appropriate mutations and queries", async () => {
    expect.assertions(4);
    await deckTest();
  }, 15000);
  // test("it creates a user, deck, card, room, chatMsg with the appropriate mutations and queries", userTest);
});
