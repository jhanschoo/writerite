import env from "./safeEnv";
import Redis from "ioredis";
import { PubSub, YogaInitialContext, createPubSub } from "graphql-yoga";

import { PrismaClient } from "@prisma/client";

import { Roles } from "./service/userJWT/Roles";
import { CurrentUser } from "./service/userJWT/CurrentUser";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { FETCH_DEPTH } from "./constants";
import { getClaims } from "./service/session";
import { PubSubPublishArgs } from "./types/PubSubPublishArgs";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

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
  isOccupyingActiveRoom(slug: string): boolean;
  addOccupyingActiveRoom(slug: string, roomId: string): void;
}

export interface Context<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
> extends YogaInitialContext {
  fetchDepth: number;
  sub?: CurrentUser;
  prisma: P;
  pubsub: PubSub<Q>;
  redis: R;
  auth: AuthorizationHelpers;
}

export interface LoggedInContext extends Context {
  sub: CurrentUser;
}

export type ContextFactoryReturnType<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
> = [
  (initialContext: YogaInitialContext) => Promise<Context>,
  () => Promise<PromiseSettledResult<unknown>[]>,
  { prisma: P; pubsub: PubSub<Q>; redis: R }
];

/**
 * Note: opts.ctx is never used if provided
 * The function, when called without params, performs creation and instantiation in the way it should be for development and production, but allows for params to be provided to expose things for testing.
 * @returns An array where the first element is the context function, and the second is a handler to close all services opened by this particular call, and the third is a debug object containing direct references to the underlying services.
 * The context function returned should abide by the contract with the Pothos schema builder that it is unique per request and does not mutate in "shape".
 */
export function contextFactory<
  P extends PrismaClient,
  Q extends PubSubPublishArgs,
  R extends Redis
>(
  opts?: Partial<Context> &
    Pick<Context<P, Q, R>, "prisma" | "pubsub" | "redis">,
  subFn?: (
    initialContext: YogaInitialContext,
    redis?: Redis
  ) => Promise<CurrentUser | undefined>
): ContextFactoryReturnType<P, Q>;
export function contextFactory(
  opts?: Partial<Context>,
  subFn?: (
    initialContext: YogaInitialContext,
    redis?: Redis
  ) => Promise<CurrentUser | undefined>
): ContextFactoryReturnType<PrismaClient, PubSubPublishArgs>;
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
): ContextFactoryReturnType<P, Q> {
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
      const additionalRoomSlugs: Record<string, string> = {};
      return {
        ...ctx,
        fetchDepth: opts?.fetchDepth ?? FETCH_DEPTH,
        sub,
        prisma,
        pubsub,
        redis,
        auth: {
          isLoggedInAs(id: string): boolean {
            return sub?.id === id;
          },
          get isAdmin(): boolean {
            return Boolean(sub?.roles.includes(Roles.Admin));
          },
          isOccupyingActiveRoom(slug: string): boolean {
            if (!sub) {
              return false;
            }
            return Boolean(
              sub.occupyingActiveRoomSlugs[slug] || additionalRoomSlugs[slug]
            );
          },
          addOccupyingActiveRoom(slug, roomId) {
            additionalRoomSlugs[slug] = roomId;
          },
        },
      };
    },
    async () =>
      Promise.allSettled([
        useDefaultPrisma
          ? prisma.$disconnect()
          : Promise.resolve("custom prisma used"),
        useDefaultRedis
          ? redis.disconnect()
          : Promise.resolve("custom redis used"),
        publishClient?.disconnect() ?? Promise.resolve("custom pubsub used"),
        subscribeClient?.disconnect() ?? Promise.resolve("custom pubsub used"),
      ]),
    { prisma: prisma as P, pubsub, redis: redis as R },
  ];
}
