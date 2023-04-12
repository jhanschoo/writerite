import type { buildHTTPExecutor } from "@graphql-tools/executor-http";
import type { PrismaClient } from "database";
import type { ExecutionResult } from "graphql";
import type Redis from "ioredis";
import type { JWTPayload } from "jose";
import type { Context } from "../../src/context";
import { parseArbitraryJWT } from "../../src/service/crypto";
import type { CurrentUser } from "../../src/service/userJWT";
import type { PubSubPublishArgs } from "../../src/types/PubSubPublishArgs";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { YogaInitialContext } from "graphql-yoga";

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
  P extends PrismaClient,
  Q extends PubSubPublishArgs,
  R extends Redis
>(
  { prisma, pubsub, redis }: Pick<Context<P, Q, R>, "prisma" | "pubsub" | "redis">,
): [(sub?: CurrentUser) => void, (initialContext: YogaInitialContext) => Promise<Context>] {
  let sub: CurrentUser | undefined;
  return [
    (newSub) => {
      sub = newSub;
    },
    async (ctx: YogaInitialContext): Promise<Context> => {
      return {
        ...ctx,
        sub,
        prisma,
        pubsub,
        redis,
      };
    }
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
