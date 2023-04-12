import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { PrismaClient } from "database";
import { ExecutionResult } from "graphql";
import Redis from "ioredis";
import { JWTPayload } from "jose";
import {
  Context,
  ContextFactoryReturnType,
  contextFactory,
} from "../../src/context";
import { parseArbitraryJWT } from "../../src/service/crypto";
import { CurrentUser } from "../../src/service/userJWT";
import { PubSubPublishArgs } from "../../src/types/PubSubPublishArgs";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

function assertSingleValue<TValue extends ExecutionResult<any, any>>(
  value: TValue | AsyncIterable<TValue>
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error("Expected single value");
  }
}
function assertStreamValue<TValue extends ExecutionResult<any, any>>(
  value: TValue | AsyncIterable<TValue>
): asserts value is AsyncIterable<TValue> {
  if (Symbol.asyncIterator in value) {
    return;
  }
  throw new Error("Expected single value");
}

export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return JSON.parse(
    parseArbitraryJWT<JWTPayload & { sub: string }>(jwt).sub
  ) as CurrentUser;
}

export function testContextFactory<
  T extends PrismaClient,
  U extends PubSubPublishArgs,
  R extends Redis
>(
  opts?: Partial<Context<T, U, R>> &
    Pick<Context<T, U, R>, "prisma" | "pubsub" | "redis">
): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType<T, U, R>];
export function testContextFactory(
  opts?: Partial<Context>
): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType];
export function testContextFactory(
  opts?: Partial<Context>
): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType] {
  let sub: CurrentUser | undefined;
  return [
    (newSub) => {
      sub = newSub;
    },
    ...contextFactory(opts, () => Promise.resolve(sub)),
  ];
}

export const isoTimestampMatcher =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d*Z$/u;

export async function testQuery<
  TResult,
  TVariables extends Record<string, any>
>({
  executor,
  document,
  variables,
}: {
  executor: ReturnType<typeof buildHTTPExecutor>;
  document: TypedDocumentNode<TResult, TVariables>;
  variables: TVariables;
}): Promise<ExecutionResult<TResult>> {
  const result = await executor({ document, variables });
  assertSingleValue(result);
  return result;
}

export async function testSubscription<
  TResult,
  TVariables extends Record<string, any>
>({
  executor,
  document,
  variables,
}: {
  executor: ReturnType<typeof buildHTTPExecutor>;
  document: TypedDocumentNode<TResult, TVariables>;
  variables: TVariables;
}): Promise<AsyncIterable<ExecutionResult<TResult>>> {
  const result = await executor({ document, variables });
  assertStreamValue(result);
  return result;
}
