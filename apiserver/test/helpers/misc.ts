import { PubSub } from "@graphql-yoga/node";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { JWTPayload } from "jose";
import { Context, ContextFactoryReturnType, PubSubPublishArgsByKey, contextFactory } from "../../src/context";
import { WrServer } from "../../src/graphqlServer";
import { parseArbitraryJWT } from "../../src/service/crypto/jwtUtil";
import { CurrentUser } from "../../src/types";


export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return JSON.parse(parseArbitraryJWT<JWTPayload & { sub: string }>(jwt).sub) as CurrentUser;
}

export function testContextFactory<T extends PrismaClient, U extends PubSubPublishArgsByKey, R extends Redis>(opts?: Partial<Context<T, U, R>> & Pick<Context<T, U, R>, "prisma" | "pubsub" | "redis">): [(sub?: CurrentUser) => void, (pubsub: PubSub<PubSubPublishArgsByKey>) => void, ...ContextFactoryReturnType<T, U, R>];
export function testContextFactory(opts?: Partial<Context>): [(sub?: CurrentUser) => void, (pubsub: PubSub<PubSubPublishArgsByKey>) => void, ...ContextFactoryReturnType];
export function testContextFactory(opts?: Partial<Context>): [(sub?: CurrentUser) => void, (pubsub: PubSub<PubSubPublishArgsByKey>) => void, ...ContextFactoryReturnType] {
  let sub: CurrentUser | undefined;
  let pubsub: PubSub<PubSubPublishArgsByKey>;
  return [
    (newSub) => {
      sub = newSub;
    },
    (newPubsub) => {
      pubsub = newPubsub;
    },
    ...contextFactory(opts, () => Promise.resolve(sub), () => pubsub),
  ];
}

export const isoTimestampMatcher = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d*Z$/u;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function inject<TData, TVariables>({ server, document, variables }: { server: WrServer, document: string, variables: TVariables }) {
  return server.inject<TData, TVariables>({
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type": "application/json",
    },
    document,
    variables,
  });
}

// dummy gql tag for codegen
export const gql = ([s]: TemplateStringsArray) => s;
