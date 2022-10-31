import {
  booleanArg,
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import type { Context } from '../context';
import { userLacksPermissionsErrorFactory, userNotLoggedInErrorFactory } from '../error';
import { guardLoggedIn } from '../service/authorization/guardLoggedIn';
import { roomFindOccupyingActiveOfUser } from '../service/room/roomFindOccupyingActiveOfUser';

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
      resolve({ id }, _args, { prisma }) {
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
  resolve: guardLoggedIn(async (_source, { name, isPublic }, { sub, prisma }) => {
    try {
      return await prisma.user.update({
        where: { id: sub.id },
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        data: { name: name?.trim() || undefined, isPublic: isPublic ?? undefined },
      });
    } catch (err) {
      throw userLacksPermissionsErrorFactory();
    }
  }),
});
