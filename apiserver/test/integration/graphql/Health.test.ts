/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";

import {
  jestForAwaitOf,
  queryHealth,
  subscriptionRepeatHealth,
  testContextFactory,
} from "../../helpers";
import { Context } from "../../../src/context";
import { YogaInitialContext } from "graphql-yoga";
import { createGraphQLApp } from "../../../src/graphqlApp";
import { cascadingDelete } from "../_helpers/truncate";
import Redis from "ioredis";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

describe("graphql/Health.ts", () => {
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;
  let redis: Redis;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    [, context, stopContext, { prisma, redis }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
    jest.useRealTimers();
    await redis.flushdb();
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
      it("should do stuff", async () => {
        jest.useFakeTimers();
        expect.assertions(5);
        const response = await subscriptionRepeatHealth(executor);
        let counter = 4;
        jest.advanceTimersByTime(2000);
        await jestForAwaitOf(
          response,
          () => jest.advanceTimersByTime(2000),
          (result) => {
            expect(result).toHaveProperty("data.repeatHealth", String(counter));
            --counter;
            return Promise.resolve();
          }
        );
      });
      it.skip("should do stuff with real timers", async () => {
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
