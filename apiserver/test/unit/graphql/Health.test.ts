import type { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import { queryHealth, testContextFactory } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { PubSub, YogaInitialContext, createPubSub } from "@graphql-yoga/node";
import { Context, PubSubPublishArgsByKey } from "../../../src/context";
import { YogaServerInstance, createServer } from "@graphql-yoga/common";
import { WrServer } from "../../../src/graphqlServer";
import { schema } from "../../../src/schema";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.user],
};

describe("graphql/Health.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Context;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: YogaServerInstance<Record<string, never>, Context, Record<string, never>>;
  let redis: DeepMockProxy<Redis.Redis>;
  let setPubsub: (pubsub: PubSub<PubSubPublishArgsByKey>) => void;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
    redis = mockDeep<Redis.Redis>();
    [setSub, setPubsub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub: createPubSub(),
      redis,
    });
    server = createServer({ context, schema });
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
        const { executionResult } = await queryHealth(server as unknown as WrServer);
        expect(executionResult).toHaveProperty("data.health", "OK");
      });
    });
  });
});
