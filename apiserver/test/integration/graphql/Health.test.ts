/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from '@prisma/client';

import { jestForAwaitOf, queryHealth, subscriptionRepeatHealth, testContextFactory } from '../../helpers';
import { Context } from '../../../src/context';
import { YogaInitialContext } from 'graphql-yoga';
import { WrServer, createGraphQLApp } from '../../../src/graphqlApp';
import { cascadingDelete } from '../_helpers/truncate';
import Redis from 'ioredis';

describe('graphql/Health.ts', () => {
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let redis: Redis;
  let app: WrServer;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    [, context, stopContext, { prisma, redis }] = testContextFactory();
    app = createGraphQLApp({ context, logging: false });
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

  describe('Query', () => {
    describe('health', () => {
      it('should return a string "OK"', async () => {
        expect.assertions(1);
        const response = await queryHealth(app);
        expect(response).toHaveProperty('data.health', 'OK');
      });
    });
  });

  describe('Subscription', () => {
    describe('repeatHealth', () => {
      it('should do stuff', async () => {
        jest.useFakeTimers();
        expect.assertions(5);
        const response = await subscriptionRepeatHealth(app);
        if (!response.body) {
          return;
        }
        let counter = 4;
        // eslint-disable-next-line @typescript-eslint/require-await
        await jestForAwaitOf(response.body, () => jest.advanceTimersByTime(1000), async (chunk) => {
          const event = JSON.parse(chunk.toString().slice(6));
          expect(event).toHaveProperty('data.repeatHealth', String(counter));
          --counter;
        });
      });
    });
  });
});
