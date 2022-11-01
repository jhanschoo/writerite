/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from '@prisma/client';
import { YogaInitialContext } from 'graphql-yoga';

import { cascadingDelete } from '../../_helpers/truncate';
import { loginAsNewlyCreatedUser, testContextFactory } from '../../../helpers';
import { Context } from '../../../../src/context';
import { WrServer, createGraphQLApp } from '../../../../src/graphqlApp';
import { CurrentUser, Roles, currentUserToUserJWT } from '../../../../src/service/userJWT';
import Redis from 'ioredis';
import {
  currentUserSourceToCurrentUser,
  findOrCreateCurrentUserSourceWithProfile,
} from '../../../../src/service/authentication/util';
import {
  getClaims,
  invalidateByRoomSlug,
  invalidateByUserId,
} from '../../../../src/service/session';
import { mutationRoomCreate } from '../../../helpers/graphql/Room.util';

describe('service/session', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let redis: Redis;
  let app: WrServer;

  beforeAll(() => {
    [setSub, , context, stopContext, { prisma, redis }] = testContextFactory();
    app = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await redis.flushdb();
    await stopContext();
  });

  afterEach(async () => {
    setSub(undefined);
    await cascadingDelete(prisma).user;
    await redis.flushdb();
  });

  it('should be able to get claims of valid JWTs on the platform', async () => {
    expect.assertions(2);

    // setup currentUser
    const user = await loginAsNewlyCreatedUser(app, setSub);
    const roomCreateResponse = await mutationRoomCreate(app);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name as string,
      'name'
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);
    expect(currentUser).toEqual({
      id: user.id,
      name: user.name,
      roles: [Roles.User],
      occupyingActiveRoomSlugs: [roomCreateResponse.data.roomCreate.slug],
    });

    // validate JWT
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) => (headerKey === 'Authorization' ? authorization : undefined),
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toEqual(currentUser);
  });

  it('should not be able to get claims after JWTs have been invalidated by userId', async () => {
    expect.assertions(1);

    // setup currentUser
    const user = await loginAsNewlyCreatedUser(app, setSub);
    await mutationRoomCreate(app);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name as string,
      'name'
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);

    // invalidate JWT
    await invalidateByUserId(redis, currentUser.id);

    // check JWT validity
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) => (headerKey === 'Authorization' ? authorization : undefined),
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toBeUndefined();
  });

  it('should not be able to get claims after JWTs have been invalidated by room slug', async () => {
    expect.assertions(1);

    // setup currentUser
    const user = await loginAsNewlyCreatedUser(app, setSub);
    const roomCreateResponse = await mutationRoomCreate(app);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name as string,
      'name'
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);

    // invalidate JWT
    await invalidateByRoomSlug(redis, roomCreateResponse.data.roomCreate.slug as string);

    // check JWT validity
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) => (headerKey === 'Authorization' ? authorization : undefined),
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toBeUndefined();
  });
});
