import { PubSub } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import request from 'supertest';
import { JWTPayload } from 'jose';
import {
  Context,
  ContextFactoryReturnType,
  PubSubPublishArgsByKey,
  contextFactory,
} from '../../src/context';
import { WrServer } from '../../src/graphqlApp';
import { parseArbitraryJWT } from '../../src/service/crypto/jwtUtil';
import { CurrentUser } from '../../src/types';

export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return JSON.parse(parseArbitraryJWT<JWTPayload & { sub: string }>(jwt).sub) as CurrentUser;
}

export function testContextFactory<
  T extends PrismaClient,
  U extends PubSubPublishArgsByKey,
  R extends Redis
>(
  opts?: Partial<Context<T, U, R>> & Pick<Context<T, U, R>, 'prisma' | 'pubsub' | 'redis'>
): [
  (sub?: CurrentUser) => void,
  (pubsub: PubSub<PubSubPublishArgsByKey>) => void,
  ...ContextFactoryReturnType<T, U, R>
];
export function testContextFactory(
  opts?: Partial<Context>
): [
  (sub?: CurrentUser) => void,
  (pubsub: PubSub<PubSubPublishArgsByKey>) => void,
  ...ContextFactoryReturnType
];
export function testContextFactory(
  opts?: Partial<Context>
): [
  (sub?: CurrentUser) => void,
  (pubsub: PubSub<PubSubPublishArgsByKey>) => void,
  ...ContextFactoryReturnType
] {
  let sub: CurrentUser | undefined;
  let pubsub: PubSub<PubSubPublishArgsByKey>;
  return [
    (newSub) => {
      sub = newSub;
    },
    (newPubsub) => {
      pubsub = newPubsub;
    },
    ...contextFactory(
      opts,
      () => Promise.resolve(sub),
      () => pubsub
    ),
  ];
}

export const isoTimestampMatcher = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d*Z$/u;

export async function testQuery<TVariables>({
  server,
  document,
  variables,
}: {
  server: WrServer;
  document: string;
  variables: TVariables;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return (
    await server.fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: document, variables }),
    })
  ).json();
}

// dummy gql tag for codegen
export const gql = ([s]: TemplateStringsArray) => s;
