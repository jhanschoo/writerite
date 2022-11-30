import {
  booleanArg,
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { Occupant, Room } from 'src/types/backingTypes';
import type { Context } from '../context';
import { userLacksPermissionsErrorFactory, userNotLoggedInErrorFactory } from '../error';
import { guardLoggedIn } from '../service/authorization/guardLoggedIn';
import { roomFindOccupyingActiveOfUser } from '../service/room/roomFindOccupyingActiveOfUser';
import { invalidateByUserId } from '../service/session';

const isPublicOrLoggedInOrAdmin = (
  { id, isPublic }: { id: string; isPublic: boolean },
  _args: unknown,
  { auth }: Context
) => isPublic || auth.isLoggedInAs(id) || auth.isAdmin;

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('name', { authorize: isPublicOrLoggedInOrAdmin });
    t.string('googleId', { authorize: isPublicOrLoggedInOrAdmin });
    t.string('facebookId', { authorize: isPublicOrLoggedInOrAdmin });
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

export const UserEditMutation = mutationField('userEdit', {
  type: nonNull('User'),
  args: {
    name: stringArg({ undefinedOnly: true }),
    isPublic: booleanArg({ undefinedOnly: true }),
  },
  description: `@invalidatesTokens(
    reason: "name may be changed"
  )`,
  resolve: guardLoggedIn(async (_source, { name, isPublic }, { prisma, redis, sub }) => {
    try {
      if (name !== undefined && sub.name !== name) {
        await invalidateByUserId(redis, sub.id);
      }
      const userRes = await prisma.user.update({
        where: { id: sub.id },
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        data: { name: name?.trim() || undefined, isPublic: isPublic ?? undefined },
      });
      return userRes;
    } catch (err) {
      throw userLacksPermissionsErrorFactory();
    }
  }),
});
