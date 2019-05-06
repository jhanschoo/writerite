import { GraphQLResolveInfo } from 'graphql';
import { MergeInfo } from 'graphql-tools';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

import { prisma, PUser } from '../generated/prisma-client';
import { Roles, IRwContext } from '../src/types';

import { rwUserQuery } from '../src/resolver/Query/RwUser.query';

const { rwUser, rwUsers } = rwUserQuery;

const redisClient = new Redis();
const pubsub = new RedisPubSub();
const baseCtx = { prisma, pubsub, redisClient } as IRwContext;
const baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };

const EMAIL = 'abc@xyz';
const OTHER_EMAIL = 'def@xyz';
const NEW_EMAIL = 'ghi@xyz';

describe('RwUser resolvers', async () => {
  let USER: PUser;
  let OTHER_USER: PUser;
  const commonBeforeEach = async () => {
    await prisma.deleteManyPUsers({});
    USER = await prisma.createPUser({ email: EMAIL });
    OTHER_USER = await prisma.createPUser({ email: OTHER_EMAIL });
  };
  const commonAfterEach = async () => {
    await prisma.deleteManyPUsers({});
  };

  beforeEach(async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
    await prisma.deleteManyPCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  });

  describe('rwUser', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no user present', async () => {
      expect.assertions(1);
      const userObj = await rwUser(null, { id: '1234567' }, baseCtx, baseInfo);
      expect(userObj).toBeNull();
    });
    test('it should return user if it exists', async () => {
      expect.assertions(1);
      const userObj = await rwUser(null, { id: USER.id }, baseCtx, baseInfo);
      if (!userObj) {
        throw new Error('`user` could not be retrieved');
      }
      expect(userObj.id).toBe(USER.id);
    });
  });

  describe('rwUsers', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      const userObj1 = await rwUsers(null, {}, baseCtx, baseInfo);
      expect(userObj1).toBeNull();
    });
    test('it should return null if not authorized as admin', async () => {
      expect.assertions(1);
      const userObj = await rwUsers(null, {}, {
        ...baseCtx,
        sub: {
          roles: [Roles.user],
        },
      } as IRwContext, baseInfo);
      expect(userObj).toBeNull();
    });
    test('it should return users if they exist', async () => {
      expect.assertions(1);
      const userObjs = await rwUsers(null, {}, {
        ...baseCtx,
        sub: {
          id: USER.id,
          roles: [Roles.user, Roles.admin],
        },
      } as IRwContext, baseInfo);
      expect(userObjs).toContainEqual(expect.objectContaining({
        id: USER.id,
      }));
    });
  });
});
