import env from './safeEnv';
import Redis from 'ioredis';
import { PubSub, YogaInitialContext, createPubSub } from 'graphql-yoga';

import { PrismaClient } from '@prisma/client';

import { FETCH_DEPTH, getClaims } from './util';
import { CurrentUser, Roles } from './types';
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

// PubSubPublishArgsByKey is declared here since GraphQL Yoga doesn't export it
export type PubSubPublishArgsByKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: [] | [any] | [number | string, any];
};

const commonRedisOptions = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
  retryStrategy: (times: number): number => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  password: REDIS_PASSWORD || undefined,
};

const redisOptions = {
  ...commonRedisOptions,
  db: 1,
};

const pubSubRedisOptions = {
  ...commonRedisOptions,
  db: 2,
};

export interface AuthorizationHelpers {
  isLoggedInAs(id: string): boolean;
  get isAdmin(): boolean;
}

export interface Context<
  T extends PrismaClient = PrismaClient,
  U extends PubSubPublishArgsByKey = PubSubPublishArgsByKey,
  R extends Redis = Redis
> extends YogaInitialContext {
  fetchDepth: number;
  sub?: CurrentUser;
  prisma: T;
  pubsub: PubSub<U>;
  redis: R;
  auth: AuthorizationHelpers;
}

export interface LoggedInContext extends Context {
  sub: CurrentUser;
}

export type ContextFactoryReturnType<
  T extends PrismaClient = PrismaClient,
  U extends PubSubPublishArgsByKey = PubSubPublishArgsByKey,
  R extends Redis = Redis
> = [
  (initialContext: YogaInitialContext) => Promise<Context>,
  () => Promise<PromiseSettledResult<unknown>[]>,
  { prisma: T; pubsub: PubSub<U>; redis: R }
];

/**
 * Note: opts.ctx is never used if provided
 * The function when called without params, performs creation and instantiation in the way it should be for development and production, but allows for params to be provided to expose things for testing.
 * @returns An array where the first element is the context function, and the second is a handler to close all services opened by this particular call, and the third is a debug object containing direct references to the underlying services.
 */
export function contextFactory<
  T extends PrismaClient,
  U extends PubSubPublishArgsByKey,
  R extends Redis
>(
  opts?: Partial<Context> & Pick<Context<T, U, R>, 'prisma' | 'pubsub' | 'redis'>,
  subFn?: (initialContext: YogaInitialContext) => Promise<CurrentUser | undefined>,
  pubsubFn?: () => PubSub<U>
): ContextFactoryReturnType<T, U>;
export function contextFactory(
  opts?: Partial<Context>,
  subFn?: (initialContext: YogaInitialContext) => Promise<CurrentUser | undefined>,
  pubsubFn?: () => PubSub<PubSubPublishArgsByKey>
): ContextFactoryReturnType<PrismaClient, PubSubPublishArgsByKey>;
export function contextFactory<
  T extends PrismaClient = PrismaClient,
  U extends PubSubPublishArgsByKey = PubSubPublishArgsByKey,
  R extends Redis = Redis
>(
  opts?: Partial<Context<T, U, R>>,
  subFn?: (initialContext: YogaInitialContext) => Promise<CurrentUser | undefined>,
  pubsubFn?: () => PubSub<U>
): ContextFactoryReturnType<T, U> {
  const useDefaultPrisma = !opts?.prisma;
  const useDefaultRedis = !opts?.redis;
  const prisma = opts?.prisma ?? new PrismaClient();
  const pubsub = pubsubFn
    ? pubsubFn()
    : opts?.pubsub ??
      createPubSub({
        eventTarget: createRedisEventTarget({
          publishClient: new Redis(pubSubRedisOptions),
          subscribeClient: new Redis(pubSubRedisOptions),
        }),
      });
  const redis = opts?.redis ?? new Redis(redisOptions);
  return [
    async (ctx: YogaInitialContext): Promise<Context> => {
      const sub = (await subFn?.(ctx)) ?? opts?.sub ?? (await getClaims(ctx));
      return {
        ...ctx,
        fetchDepth: opts?.fetchDepth ?? FETCH_DEPTH,
        sub,
        prisma,
        pubsub: pubsubFn?.() ?? pubsub,
        redis,
        auth: {
          isLoggedInAs(id: string): boolean {
            return sub?.id === id;
          },
          get isAdmin(): boolean {
            return Boolean(sub?.roles.includes(Roles.Admin));
          },
        },
      };
    },
    async () =>
      Promise.allSettled([
        useDefaultPrisma ? prisma.$disconnect() : Promise.resolve('custom prisma used'),
        useDefaultRedis ? redis.disconnect() : Promise.resolve('custom redis used'),
      ]),
    { prisma: prisma as T, pubsub, redis: redis as R },
  ];
}
