import { Redis } from 'ioredis';
import { PubSubEngine } from 'apollo-server-koa';

import { Prisma } from '../generated/prisma-client';
import { IModels } from './model';
import { Readable } from 'stream';

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

export enum Roles {
  user = 'user',
  admin = 'admin',
  wright = 'wright',
}

export interface IFileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

export type IUpload = Promise<IFileUpload>;

export interface ICurrentUser {
  id: string;
  email: string;
  roles: Roles[];
}

export interface ICreatedUpdate<T> {
  created: T;
}

export interface IUpdatedUpdate<T> {
  updated: T;
}

export interface IDeletedUpdate<T> {
  deletedId: string;
}

export type IUpdate<T> =
  | ICreatedUpdate<T>
  | IUpdatedUpdate<T>
  | IDeletedUpdate<T>
  ;
