import { Redis } from "ioredis";
import { PubSubEngine } from "apollo-server-koa";

import { Readable } from "stream";
import { WrDataSource } from "./datasource/WrDataSource";

export type AFunResTo<T> = (() => Promise<T>);

export type FunResTo<T> = (() => T);

export type ResTo<T> = Exclude<T, Function> | FunResTo<Exclude<T, Function>> | AFunResTo<Exclude<T, Function>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Returns<T> = ((...args: any[]) => T);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordOfKeys<T extends any> = { [P in T[number]]: unknown; };
export type Concrete<T> = { [P in keyof T]-?: Exclude<T[P], Function>; };

export interface WrContext {
  sub?: CurrentUser;
  pubsub: PubSubEngine;
  redisClient: Redis;
  dataSources: {
    wrDS: WrDataSource<WrContext>;
  };
}

export enum AuthorizerType {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  LOCAL = "LOCAL",
  DEVELOPMENT = "DEVELOPMENT",
}

export enum Roles {
  user = "user",
  admin = "admin",
  wright = "wright",
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

export type Upload = Promise<FileUpload>;

export interface CurrentUser {
  id: string;
  roles: Roles[];
}

export interface CreatedUpdate<T> {
  created: T;
}

export interface UpdatedUpdate<T> {
  updated: T;
}

export interface DeletedUpdate<T> {
  deletedId: string;
}

export type Update<T> =
  | CreatedUpdate<T>
  | UpdatedUpdate<T>
  | DeletedUpdate<T>;

