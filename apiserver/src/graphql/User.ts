import {
  booleanArg,
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { guardValidUser } from '../service/authorization';
import { Roles } from '../service/userJWT';
import { Room } from '../types/backingTypes';
import type { Context } from '../context';
import {
  invalidArgumentsErrorFactory,
  userLacksPermissionsErrorFactory,
  userNotLoggedInErrorFactory,
} from '../error';
import { guardLoggedIn } from '../service/authorization/guardLoggedIn';
import { roomFindOccupyingActiveOfUser } from '../service/room/roomFindOccupyingActiveOfUser';
import { invalidateByUserId } from '../service/session';
import { Prisma } from '@prisma/client';
import { jsonObjectArg } from './scalarUtil';
import { z } from 'zod';
import { jsonObjectSchema } from '../service/validation/jsonSchema';

const isPublicOrLoggedInOrAdmin = (
  { id, isPublic }: { id: string; isPublic: boolean },
  _args: unknown,
  { auth }: Context
) => isPublic || auth.isLoggedInAs(id) || auth.isAdmin;

const isLoggedInOrAdmin = ({ id }: { id: string }, _args: unknown, { auth }: Context) =>
  auth.isLoggedInAs(id) || auth.isAdmin;

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('name', { authorize: isPublicOrLoggedInOrAdmin });
    t.string('googleId', { authorize: isLoggedInOrAdmin });
    t.string('facebookId', { authorize: isLoggedInOrAdmin });
    t.jsonObject('bio', {
      authorize: isPublicOrLoggedInOrAdmin,
      resolve({ bio }) {
        return bio as Prisma.JsonObject | null;
      },
    });
    t.nonNull.list.nonNull.string('roles', { authorize: isPublicOrLoggedInOrAdmin });
    t.nonNull.boolean('isPublic');

    t.nonNull.list.nonNull.field('decks', {
      type: 'Deck',
      authorize: isPublicOrLoggedInOrAdmin,
      resolve({ id }, _args, { prisma }) {
        return prisma.deck.findMany({ where: { ownerId: id } });
      },
    });
    t.nonNull.list.nonNull.field('ownedRooms', {
      type: 'Room',
      authorize: isPublicOrLoggedInOrAdmin,
      resolve({ id }, _args, { prisma }) {
        return prisma.room.findMany({ where: { ownerId: id } });
      },
    });
    t.nonNull.list.nonNull.field('occupyingActiveRooms', {
      type: 'Room',
      authorize: isPublicOrLoggedInOrAdmin,
      resolve({ occupyingRooms, id }, _args, { prisma }) {
        if (occupyingRooms) {
          /*
           * assumption: occupyingRooms has been filtered to only contain those whose states are not in WillNotServeRoomStates
           * see e.g. src/service/authentication/util.ts#32
           */
          const rooms = occupyingRooms
            .map(({ room }) => room)
            .filter((optionalRoom): optionalRoom is Room => Boolean(optionalRoom));
          return rooms;
        }
        return roomFindOccupyingActiveOfUser(prisma, { occupantId: id });
      },
    });
    t.nonNull.list.nonNull.field('befriendeds', {
      type: 'User',
      description: 'users who this user have unilaterally befriended without reciprocation',
      resolve: guardValidUser(({ id: befrienderId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && befrienderId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.findMany({
          where: {
            befriendedIn: { some: { befrienderId } },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            NOT: { befrienderIn: { some: { befriendedId: befrienderId } } },
          },
        });
      }),
    });
    t.nonNull.int('befriendedsCount', {
      description: 'count of users unilaterally befriended by this user without reciprocation',
      resolve: guardValidUser(({ id: befrienderId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && befrienderId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.count({
          where: {
            befriendedIn: { some: { befrienderId } },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            NOT: { befrienderIn: { some: { befriendedId: befrienderId } } },
          },
        });
      }),
    });
    t.nonNull.list.nonNull.field('befrienders', {
      type: 'User',
      description: 'users who have unilaterally befriended this user without reciprocation',
      resolve: guardValidUser(({ id: befriendedId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && befriendedId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.findMany({
          where: {
            befrienderIn: { some: { befriendedId } },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            NOT: { befriendedIn: { some: { befrienderId: befriendedId } } },
          },
        });
      }),
    });
    t.nonNull.int('befriendersCount', {
      description:
        'count of users who have unilaterally befriended this user without reciprocation',
      resolve: guardValidUser(({ id: befriendedId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && befriendedId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.count({
          where: {
            befrienderIn: { some: { befriendedId } },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            NOT: { befriendedIn: { some: { befrienderId: befriendedId } } },
          },
        });
      }),
    });
    t.nonNull.list.nonNull.field('friends', {
      type: 'User',
      description: 'users who are mutual friends of this user',
      resolve: guardValidUser(({ id: userId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && userId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.findMany({
          where: {
            befrienderIn: { some: { befriendedId: userId } },
            befriendedIn: { some: { befrienderId: userId } },
          },
        });
      }),
    });
    t.nonNull.int('friendsCount', {
      description: 'count of users who are mutual friends of this user',
      resolve: guardValidUser(({ id: userId }, _args, { prisma, sub }) => {
        if (!sub.roles.includes(Roles.Admin) && userId !== sub.id) {
          throw userLacksPermissionsErrorFactory();
        }
        return prisma.user.count({
          where: {
            befrienderIn: { some: { befriendedId: userId } },
            befriendedIn: { some: { befrienderId: userId } },
          },
        });
      }),
    });
  },
});

export const UserQuery = queryField('user', {
  type: nonNull('User'),
  args: {
    id: idArg(),
  },
  resolve: async (_source, { id: idArgument }, { prisma, sub }) => {
    const id = idArgument ?? sub?.id;
    if (!id) {
      throw userNotLoggedInErrorFactory();
    }
    const res = await prisma.user.findUnique({
      where: { id },
    });
    if (!res) {
      throw userLacksPermissionsErrorFactory();
    }
    return res;
  },
});

export const userEditSchema = z.object({
  id: z.string().min(20).optional(),
  name: z.string().trim().optional(),
  bio: jsonObjectSchema.nullable().optional(),
  isPublic: z.boolean().optional(),
});

export const UserEditMutation = mutationField('userEdit', {
  type: nonNull('User'),
  args: {
    id: stringArg({ undefinedOnly: true }),
    name: stringArg({ undefinedOnly: true }),
    bio: jsonObjectArg(),
    isPublic: booleanArg({ undefinedOnly: true }),
  },
  description: `@invalidatesTokens(
    reason: "name may be changed"
  )`,
  resolve: guardLoggedIn(async (_source, args, { prisma, redis, sub }) => {
    args.id = args.id ?? sub.id;
    const { id, name, bio, isPublic } = userEditSchema.parse(args);
    if (id !== sub.id && !sub.roles.includes(Roles.Admin)) {
      throw userLacksPermissionsErrorFactory();
    }
    try {
      const userRes = await prisma.user.update({
        where: { id },
        data: {
          name,
          bio: bio === null ? Prisma.DbNull : bio,
          isPublic,
        },
      });
      await invalidateByUserId(redis, sub.id);
      return userRes;
    } catch (err) {
      throw userLacksPermissionsErrorFactory();
    }
  }),
});

export const UserBefriendUserMutation = mutationField('userBefriendUser', {
  type: nonNull('User'),
  args: {
    befriendedId: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { befriendedId }, { prisma, sub: { id } }) => {
    if (befriendedId === id) {
      throw invalidArgumentsErrorFactory('Yor cannot befriend yourself!');
    }
    return prisma.user.update({
      where: { id: befriendedId },
      data: {
        befriendedIn: {
          connectOrCreate: {
            where: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              befrienderId_befriendedId: { befrienderId: id, befriendedId },
            },
            create: { befriender: { connect: { id } } },
          },
        },
      },
    });
  }),
});
