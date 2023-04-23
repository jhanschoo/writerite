import type { PrismaClient } from 'database';
import type { PubSub, YogaInitialContext } from 'graphql-yoga';
import type Redis from 'ioredis';

import type { CurrentUser } from './service/userJWT/CurrentUser';
import type { PubSubPublishArgs } from './types/PubSubPublishArgs';

export interface Context<
  P extends PrismaClient = PrismaClient,
  Q extends PubSubPublishArgs = PubSubPublishArgs,
  R extends Redis = Redis
> extends YogaInitialContext {
  sub?: CurrentUser;
  prisma: P;
  pubsub: PubSub<Q>;
  redis: R;
}

export interface LoggedInContext extends Context {
  sub: CurrentUser;
}
