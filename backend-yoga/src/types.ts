import { Redis } from 'ioredis';
import { PubSubEngine } from 'apollo-server-express';

import { Prisma } from '../generated/prisma-client';

export type AFunResTo<T> = ((parent: any) => Promise<T>);
export type FunResTo<T> = ((parent: any) => T);

export type ResTo<T> =
  | AFunResTo<T>
  | FunResTo<T>
  | T;

export interface IRwContext {
  sub?: ICurrentUser;
  prisma: Prisma;
  pubsub: PubSubEngine;
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
