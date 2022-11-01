import { Room as PRoom, RoomState as PRoomState, Prisma } from '@prisma/client';
import { enumType, idArg, list, mutationField, nonNull, objectType, queryField } from 'nexus';
import { userLacksPermissionsErrorFactory } from '../error';
import { guardValidUser } from '../service/authorization/guardValidUser';
import {
  WillNotServeRoomStates,
  roomAddOccupant,
  roomEditOwnerConfig,
  roomSetDeck,
  roomSetState,
} from '../service/room';
import { invalidateByRoomSlug, invalidateByUserId } from '../service/session';
import { slug } from '../util';
import { jsonObjectArg } from './scalarUtil';

export const Room = objectType({
  name: 'Room',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('ownerId');
    t.id('deckId');
    t.nonNull.jsonObject('ownerConfig', {
      resolve({ ownerConfig }) {
        return ownerConfig as Prisma.JsonObject;
      },
    });
    t.nonNull.jsonObject('internalConfig', {
      resolve({ internalConfig }) {
        return internalConfig as Prisma.JsonObject;
      },
    });
    t.string('slug');
    t.nonNull.field('state', {
      type: 'RoomState',
    });
    t.nonNull.dateTime('createdAt');

    t.field('deck', {
      type: 'Deck',
      async resolve({ deckId }, _args, { prisma }) {
        if (!deckId) {
          return null;
        }
        const deck = await prisma.deck.findUnique({ where: { id: deckId } });
        if (deck === null) {
          throw new Error(`Could not find deck with id ${deckId}`);
        }
        return deck;
      },
    });
    t.nonNull.list.nonNull.field('messages', {
      type: 'Message',
      resolve({ id }, _args, { prisma }) {
        return prisma.message.findMany({ where: { roomId: id } });
      },
    });
    t.nonNull.int('messageCount', {
      resolve({ id }, _args, { prisma }) {
        return prisma.message.count({ where: { roomId: id } });
      },
    });
    t.nonNull.list.nonNull.field('occupants', {
      type: 'User',
      resolve({ id }, _args, { prisma }) {
        return prisma.user.findMany({ where: { occupyingRooms: { some: { roomId: id } } } });
      },
    });
    t.nonNull.int('occupantsCount', {
      resolve({ id }, _args, { prisma }) {
        return prisma.occupant.count({ where: { roomId: id } });
      },
    });
    t.nonNull.field('owner', {
      type: 'User',
      async resolve({ ownerId }, _args, { prisma }) {
        const user = await prisma.user.findUnique({ where: { id: ownerId } });
        if (user === null) {
          throw new Error(`Could not find user with id ${ownerId}`);
        }
        return user;
      },
    });
  },
});

export const RoomState = enumType({
  name: 'RoomState',
  members: ['WAITING', 'SERVING', 'SERVED'],
});

export const RoomQuery = queryField('room', {
  type: nonNull('Room'),
  args: { id: nonNull(idArg()) },
  resolve: guardValidUser(async (_source, { id }, { prisma, sub }) => {
    const res = await prisma.room.findUnique({
      where: { id, ownerId: sub.id },
    });
    if (!res) {
      throw userLacksPermissionsErrorFactory();
    }
    return res;
  }),
});

export const OccupyingActiveRoomsQuery = queryField('occupyingActiveRooms', {
  type: nonNull(list(nonNull('Room'))),
  resolve: guardValidUser((_source, _args, { prisma, sub }) =>
    prisma.room.findMany({
      where: {
        occupants: { some: { occupantId: sub.id } },
        state: { notIn: WillNotServeRoomStates },
      },
    })
  ),
});

export const RoomCreateMutation = mutationField('roomCreate', {
  type: nonNull('Room'),
  description: `@invalidatesTokens(
    reason: "occupying newly created room"
  )
  @triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, _args, { prisma, redis, sub }) => {
    const { id } = sub;
    await invalidateByUserId(redis, id);
    return prisma.room.create({
      data: {
        owner: { connect: { id } },
        occupants: { create: { occupantId: id } },
        state: PRoomState.WAITING,
        slug: slug(),
      },
    });
  }),
});

// Only legal when room state is WAITING
export const RoomSetDeckMutation = mutationField('roomSetDeck', {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
    deckId: nonNull(idArg()),
  },
  description: `@triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, { id: roomId, deckId }, { prisma, sub }) =>
    roomSetDeck(prisma, { roomId, deckId, currentUserId: sub.id })
  ),
});

// Only legal when room state is WAITING
export const RoomEditOwnerConfigMutation = mutationField('roomEditOwnerConfig', {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
    ownerConfig: nonNull(jsonObjectArg()),
  },
  description: `@triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  async resolve(_parent, { id, ownerConfig }, { prisma }) {
    return roomEditOwnerConfig(prisma, { id, ownerConfig: ownerConfig as Prisma.InputJsonObject });
  },
});

export const RoomSetStateMutation = mutationField('roomSetState', {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
    state: nonNull('RoomState'),
  },
  description: `@invalidatesTokens(
    reason: "room may no longer be active"
  )
  @triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, { id, state }, { prisma, redis, sub }) => {
    let previousRoom: PRoom | null | undefined;
    if (WillNotServeRoomStates.includes(state)) {
      previousRoom = await prisma.room.findUnique({ where: { id } });
    }
    const roomRes = await roomSetState(prisma, {
      id,
      state,
      currentUserId: sub.id,
    });
    if (previousRoom?.slug) {
      await invalidateByRoomSlug(redis, previousRoom.slug);
    }
    return roomRes;
  }),
});

export const RoomCleanUpDeadMutation = mutationField('roomCleanUpDead', {
  type: nonNull('Int'),
  resolve() {
    throw Error('not implemented yet');
  },
});

// Only legal when room state is WAITING
export const RoomAddOccupantMutation = mutationField('roomAddOccupant', {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
    occupantId: nonNull(idArg()),
  },
  description: `@invalidatesTokens(
    reason: "occupying existing room"
  )
  @triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser((_parent, { id, occupantId }, { prisma, sub }) =>
    roomAddOccupant(prisma, { roomId: id, occupantId, currentUserId: sub.id })
  ),
});
