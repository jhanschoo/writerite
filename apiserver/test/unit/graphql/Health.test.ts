/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import { queryHealth, testContextFactory } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { Context, PubSubPublishArgsByKey } from "../../../src/context";
import { PubSub, YogaInitialContext, YogaServerInstance, createPubSub, createYoga } from "graphql-yoga";
import { WrServer } from "../../../src/graphqlApp";
import { schema } from "../../../src/schema";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.user],
};

describe("graphql/Health.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: YogaServerInstance<Record<string, never>, Context>;
  let redis: DeepMockProxy<Redis>;
  let setPubsub: (pubsub: PubSub<PubSubPublishArgsByKey>) => void;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>();
    redis = mockDeep<Redis>();
    [setSub, setPubsub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub: createPubSub(),
      redis,
    });
    server = createYoga({ context, schema, logging: false });
  });

  afterAll(async () => {
    await Promise.allSettled([stopContext()]);
  });

  afterEach(() => {
    setSub();
    setPubsub(createPubSub());
    mockReset(prisma);
    mockReset(redis);
  });

  describe("Query", () => {
    describe("health", () => {
      it("should return a string \"OK\"", async () => {
        expect.assertions(1);
        const response = await queryHealth(server as unknown as WrServer);
        expect(response).toHaveProperty("data.health", "OK");
      });
    });
  });
});
