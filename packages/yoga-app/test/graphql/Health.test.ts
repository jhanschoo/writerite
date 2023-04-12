/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "database";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import {
  jestForAwaitOf,
  queryHealth,
  subscriptionRepeatHealth,
  testContextFactory,
} from "../helpers";
import { Context } from "../../src/context";
import { YogaInitialContext, createPubSub, createYoga } from "graphql-yoga";
import { schema } from "../../src/schema";
import { CurrentUser, Roles } from "../../src/service/userJWT";
import { GraphQLResolveInfo } from "graphql";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.User],
};

describe("graphql/Health.ts", () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let prisma: DeepMockProxy<PrismaClient>;
  let executor: ReturnType<typeof buildHTTPExecutor>;
  let redis: DeepMockProxy<Redis>;
  const pubsub = createPubSub();

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>();
    redis = mockDeep<Redis>();
    [setSub, context] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub,
      redis,
    });
    const server = createYoga({ context, schema, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterEach(() => {
    setSub();
    mockReset(prisma);
    mockReset(redis);
    jest.useRealTimers();
  });

  describe("Query", () => {
    describe("health", () => {
      it('should return a string "OK"', async () => {
        expect.assertions(1);
        const response = await queryHealth(executor);
        expect(response).toHaveProperty("data.health", "OK");
      });
    });
  });

  describe("Subscription", () => {
    describe("repeatHealth", () => {
      it("the iterator itself should do stuff", async () => {
        jest.useFakeTimers();
        const subscribe = schema.getSubscriptionType()?.getFields()
          .repeatHealth.subscribe;
        expect.assertions(5);
        let counter = 4;
        const iter = await subscribe?.(
          undefined,
          undefined,
          {},
          {} as GraphQLResolveInfo
        );
        if (!iter) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/require-await
        await jestForAwaitOf(
          iter as AsyncIterable<string>,
          () => jest.advanceTimersByTime(2000),
          // eslint-disable-next-line @typescript-eslint/require-await
          async (chunk) => {
            expect(chunk).toEqual(String(counter));
            --counter;
          }
        );
      });
      it("should do stuff", async () => {
        jest.useFakeTimers();
        expect.assertions(5);
        const response = await subscriptionRepeatHealth(executor);
        let counter = 4;
        // eslint-disable-next-line @typescript-eslint/require-await
        await jestForAwaitOf(
          response,
          () => jest.advanceTimersByTime(2000),
          // eslint-disable-next-line @typescript-eslint/require-await
          async (result) => {
            expect(result).toHaveProperty("data.repeatHealth", String(counter));
            --counter;
          }
        );
      });
      it.skip("should do stuff if we advance the timers", async () => {
        jest.useFakeTimers({ advanceTimers: true });
        expect.assertions(5);
        const response = await subscriptionRepeatHealth(executor);
        let counter = 4;
        for await (const result of response) {
          expect(result).toHaveProperty("data.repeatHealth", String(counter));
          --counter;
        }
      }, 10000);
    });
  });
});
