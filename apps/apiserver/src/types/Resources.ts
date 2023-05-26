import type { PrismaClient } from 'database';
import type { PubSub } from 'graphql-yoga';
import type Redis from 'ioredis';
import type { PubSubPublishArgs } from 'yoga-app';

export interface Resources<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
> {
  prisma: P;
  pubsub: PubSub<Q>;
  redis: R;
}
