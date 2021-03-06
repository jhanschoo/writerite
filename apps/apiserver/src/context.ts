import { createRedisEventTarget } from '@graphql-yoga/redis-event-target';
import { PrismaClient } from 'database';
import { YogaInitialContext, createPubSub } from 'graphql-yoga';
import Redis from 'ioredis';
import { Context, CurrentUser, PubSubPublishArgs, getClaims } from 'yoga-app';

import { commonRedisOptions } from './constants/commonRedisOptions';
import { Resources } from './types/Resources';

const redisOptions = {
  ...commonRedisOptions,
  db: 1,
};

const pubSubRedisOptions = {
  ...commonRedisOptions,
  db: 2,
};

export type ContextFactoryReturnType<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
> = [
  (initialContext: YogaInitialContext) => Promise<Context>,
  () => Promise<PromiseSettledResult<unknown>[]>,
  Resources<P, Q, R>
];

/**
 * Note: opts.ctx is never used if provided
 * The function, when called without params, performs creation and instantiation in the way it should be for development and production, but allows for params to be provided to expose things for testing.
 * @param opts context fields to use instead of initializing new instances; useful for testing
 * @param subFn a function that returns the current user; overriding what is supplied in `opts` or the default function; useful for testing
 * @returns An array where the first element is the context function, and the second is a handler to close all services opened by this particular call, and the third is a debug object containing direct references to the underlying services.
 * The context function returned should abide by the contract with the Pothos schema builder that it is unique per request and does not mutate in "shape".
 */
export function contextFactory<
  P extends PrismaClient,
  Q extends PubSubPublishArgs,
  R extends Redis
>(
  opts?: Partial<Context> &
    Pick<Context<P, Q, R>, 'prisma' | 'pubsub' | 'redis'>,
  subFn?: (
    initialContext: YogaInitialContext,
    redis?: R
  ) => Promise<CurrentUser | undefined>
): ContextFactoryReturnType<P, Q, R>;
export function contextFactory(
  opts?: Partial<Context>,
  subFn?: (
    initialContext: YogaInitialContext,
    redis?: Redis
  ) => Promise<CurrentUser | undefined>
): ContextFactoryReturnType;
/**
 *
 * @param opts
 * @param subFn
 */
export function contextFactory<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
>(
  opts?: Partial<Context<P, Q, R>>,
  subFn?: (
    initialContext: YogaInitialContext,
    redis?: Redis
  ) => Promise<CurrentUser | undefined>
): ContextFactoryReturnType<P, Q, R> {
  const useDefaultPrisma = !opts?.prisma;
  const useDefaultRedis = !opts?.redis;
  const useDefaultPubsub = !opts?.pubsub;
  const publishClient = useDefaultPubsub
    ? new Redis(pubSubRedisOptions)
    : undefined;
  const subscribeClient = useDefaultPubsub
    ? new Redis(pubSubRedisOptions)
    : undefined;
  const prisma = opts?.prisma ?? new PrismaClient();
  const pubsub =
    opts?.pubsub ??
    createPubSub({
      eventTarget: createRedisEventTarget({
        publishClient: publishClient as Redis,
        subscribeClient: subscribeClient as Redis,
      }),
    });
  const redis = opts?.redis ?? new Redis(redisOptions);
  return [
    async (ctx: YogaInitialContext): Promise<Context> => {
      const sub =
        (await subFn?.(ctx, redis)) ??
        opts?.sub ??
        (await getClaims(ctx, redis));
      return {
        ...ctx,
        sub,
        prisma,
        pubsub,
        redis,
      };
    },
    async () =>
      Promise.allSettled([
        useDefaultPrisma
          ? prisma.$disconnect()
          : Promise.resolve('custom prisma used'),
        useDefaultRedis
          ? redis.disconnect()
          : Promise.resolve('custom redis used'),
        publishClient?.disconnect() ?? Promise.resolve('custom pubsub used'),
        subscribeClient?.disconnect() ?? Promise.resolve('custom pubsub used'),
      ]),
    { prisma: prisma as P, pubsub, redis: redis as R },
  ];
}
