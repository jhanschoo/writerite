import { ContextParameters } from 'graphql-yoga/dist/types';
import { Prisma } from '../generated/prisma-client';
import { PubSub } from 'graphql-yoga';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

export type AFunResTo<T> = ((parent: any) => Promise<T>);
export type FunResTo<T> = ((parent: any) => T);

export type ResTo<T> =
  | AFunResTo<T>
  | FunResTo<T>
  | T;

export interface IRwContext {
  req: ContextParameters;
  sub?: ICurrentUser;
  prisma: Prisma;
  pubsub: PubSub | RedisPubSub;
  redisClient: Redis;
}

export enum AuthorizerType {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  LOCAL = 'LOCAL',
  DEVELOPMENT = 'DEVELOPMENT',
}

export enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export enum Roles {
  user = 'user',
  admin = 'admin',
  acolyte = 'acolyte',
}

export interface ICurrentUser {
  id: string;
  email: string;
  roles: Roles[];
}

export interface ICreatedUpdate<T> {
  mutation: MutationType.CREATED;
  new: T;
  oldId: null;
}

export interface IUpdatedUpdate<T> {
  mutation: MutationType.UPDATED;
  new: T;
  oldId: null;
}

export interface IDeletedUpdate<T> {
  mutation: MutationType.DELETED;
  new: null;
  oldId: string;
}

export type IUpdate<T> =
  | ICreatedUpdate<T>
  | IUpdatedUpdate<T>
  | IDeletedUpdate<T>
  ;
