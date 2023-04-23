import { prismaConnectionHelpers } from '@pothos/plugin-prisma';

import { builder } from '../../builder';
import { PPUBLIC, User } from '../User';

export const Friendship = builder.prismaNode('Friendship', {
  id: { field: 'id' },
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    befriender: t.relation('befriender'),
    befriended: t.relation('befriended'),
  }),
});

builder.queryFields((t) => ({
  befriendeds: t.withAuth({ authenticated: true }).prismaConnection({
    type: User,
    cursor: 'id',
    description: 'users you have unilaterally befriended',
    resolve: async (query, _root, _args, { prisma, sub }) => {
      const { bareId } = sub;
      const res = await prisma.user.findMany({
        ...query,
        where: {
          befriendedIn: { some: { befrienderId: bareId } },
          befrienderIn: { none: { befriendedId: bareId } },
        },
        orderBy: {
          name: 'asc',
        },
      });
      return res;
    },
  }),
  friends: t.withAuth({ authenticated: true }).prismaConnection({
    type: User,
    cursor: 'id',
    description: 'users who are mutual friends with you',
    resolve: async (query, _root, _args, { prisma, sub }) => {
      const { bareId } = sub;
      const res = await prisma.user.findMany({
        ...query,
        where: {
          befriendedIn: { some: { befrienderId: bareId } },
          befrienderIn: { some: { befriendedId: bareId } },
        },
        orderBy: {
          name: 'asc',
        },
      });
      return res;
    },
  }),
  befrienders: t.withAuth({ authenticated: true }).prismaConnection({
    type: User,
    cursor: 'id',
    description: 'users that have befriended you',
    resolve: async (query, _root, _args, { prisma, sub }) => {
      const { bareId } = sub;
      const res = await prisma.user.findMany({
        ...query,
        where: {
          befriendedIn: { none: { befrienderId: bareId } },
          befrienderIn: { some: { befriendedId: bareId } },
        },
        orderBy: {
          name: 'asc',
        },
      });
      return res;
    },
  }),
}));
