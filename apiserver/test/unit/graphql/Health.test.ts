/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import Redis from 'ioredis';

import { jestForAwaitOf, queryHealth, subscriptionRepeatHealth, testContextFactory } from '../../helpers';
import { Context } from '../../../src/context';
import { YogaInitialContext, YogaServerInstance, createPubSub, createYoga } from 'graphql-yoga';
import { WrServer } from '../../../src/graphqlApp';
import { schema } from '../../../src/schema';
import { CurrentUser, Roles } from '../../../src/service/userJWT';
import { GraphQLResolveInfo } from 'graphql';

export const DEFAULT_CURRENT_USER = {
  id: 'fake-id',
  name: 'fake-name',
  roles: [Roles.User],
};

describe('graphql/Health.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: YogaServerInstance<Record<string, never>, Context>;
  let redis: DeepMockProxy<Redis>;
  const pubsub = createPubSub();

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>();
    redis = mockDeep<Redis>();
    [setSub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub,
      redis,
    });
    server = createYoga({ context, schema, logging: false });
  });

  afterAll(async () => {
    await Promise.allSettled([stopContext()]);
  });

  afterEach(() => {
    setSub();
    mockReset(prisma);
    mockReset(redis);
    jest.useRealTimers();
  });

  describe('Query', () => {
    describe('health', () => {
      it('should return a string "OK"', async () => {
        expect.assertions(1);
        const response = await queryHealth(server as unknown as WrServer);
        expect(response).toHaveProperty('data.health', 'OK');
      });
    });
  });

  describe('Subscription', () => {
    describe('repeatHealth', () => {
      it('the iterator itself should do stuff', async () => {
        jest.useFakeTimers();
        const subscribe = schema.getSubscriptionType()?.getFields().repeatHealth.subscribe;
        expect.assertions(5);
        jest.advanceTimersByTime(2000);
        jest.runAllTimers();
        let counter = 4;
        const iter = await subscribe?.(undefined, undefined, {}, {} as GraphQLResolveInfo);
        if (!iter) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/require-await
        await jestForAwaitOf(iter as AsyncIterable<string>, () => jest.advanceTimersByTime(2000), async (chunk) => {
          console.log(chunk);
          expect(chunk).toEqual(String(counter));
          --counter;
        });
      });
      it('should do stuff', async () => {
        jest.useFakeTimers();
        expect.assertions(5);
        const response = await subscriptionRepeatHealth(server as unknown as WrServer);
        if (!response.body) {
          return;
        }
        let counter = 4;
        // eslint-disable-next-line @typescript-eslint/require-await
        await jestForAwaitOf(response.body, () => jest.advanceTimersByTime(2000), async (chunk) => {
          const event = JSON.parse(chunk.toString().slice(6));
          expect(event).toHaveProperty('data.repeatHealth', String(counter));
          --counter;
        });
      });
    });
  });
});
