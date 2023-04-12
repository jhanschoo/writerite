import { MergeInfo, PubSubEngine } from "apollo-server-koa";

import { Readable } from "stream";
import { PrismaClient } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "koa";
import { ExecutionParams } from "subscriptions-transport-ws";

// c.f. graphql-tools/dist/Interfaces.d.ts
export type FieldResolver<
  TSource,
  TContext,
  TArgs = Record<string, unknown>,
  TReturn = unknown
> = (
  source: TSource,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
) => TReturn | Promise<TReturn>;

export interface IntegrationContext {
  ctx?: Context;
  connection?: ExecutionParams<{ Authorization?: string }>;
}

export interface WrContext extends IntegrationContext {
  fetchDepth: number;
  sub?: CurrentUser;
  prisma: PrismaClient;
  pubsub: PubSubEngine;
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
  email: string;
  name: string | null;
  roles: Roles[];
}

export enum UpdateType {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CREATED = "CREATED",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  EDITED = "EDITED",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DELETED = "DELETED",
}

export interface Update<T> {
  type: UpdateType;
  data: T | null;
}

export type SubscriptionIterator<T> = AsyncIterator<Update<T>>;
