import { Redis } from 'ioredis';
import { PubSubEngine } from 'apollo-server-koa';

import { Prisma } from '../generated/prisma-client';
import { IModels } from './model';

export type AFunResTo<TReturn> = (() => Promise<TReturn>);

export interface IModel<T> {
  [key: string]: (...args: any[]) => null | T | T[] | string | boolean | Promise<null | T | T[] | string | boolean>;
}

export interface IContext {
  sub?: ICurrentUser;
  models: IModels;
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
