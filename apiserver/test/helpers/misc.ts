import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { JWTPayload } from 'jose';
import { Context, ContextFactoryReturnType, contextFactory } from '../../src/context';
import { WrServer } from '../../src/graphqlApp';
import { parseArbitraryJWT } from '../../src/service/crypto';
import { CurrentUser } from '../../src/service/userJWT';
import { PubSubPublishArgs } from '../../src/types/PubSubPublishArgs';

export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return JSON.parse(parseArbitraryJWT<JWTPayload & { sub: string }>(jwt).sub) as CurrentUser;
}

export function testContextFactory<
  T extends PrismaClient,
  U extends PubSubPublishArgs,
  R extends Redis
>(
  opts?: Partial<Context<T, U, R>> & Pick<Context<T, U, R>, 'prisma' | 'pubsub' | 'redis'>
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

export async function testSubscription<TVariables>({
  server,
  document,
  variables,
}: {
  server: WrServer;
  document: string;
  variables: TVariables;
}) {
  const uri = encodeURI(`http://localhost:4000/graphql?query=${document}${variables ? `&variables=${JSON.stringify(variables)}` : ''}`)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const ret = server.fetch(uri, {
    method: 'GET',
    headers: {
      accept: 'text/event-stream',
    },
  });
  return ret;
}

// dummy gql tag for codegen
export const gql = ([s]: TemplateStringsArray) => s;
