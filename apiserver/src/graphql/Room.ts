import { Room as PRoom, RoomState as PRoomState, Prisma } from '@prisma/client';
import { Room as BackingRoom } from '../types/backingTypes';
import {
  enumType,
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
  subscriptionField,
} from 'nexus';
import { userLacksPermissionsErrorFactory } from '../error';
import { guardValidUser } from '../service/authorization/guardValidUser';
import {
  ROOM_UPDATES_BY_ROOM_SLUG_TOPIC,
  WillNotServeRoomStates,
  roomAddOccupant,
  roomSetDeck,
  roomSetState,
} from '../service/room';
import { invalidateByRoomSlug, invalidateByUserId } from '../service/session';
import { slug as genSlug } from '../util';

const ROOM_SET_DECK_KEY = 'roomSetDeck';
const ROOM_JOIN_KEY = 'roomJoin';
const ROOM_SET_STATE_KEY = 'roomSetState';

const ROOM_UPDATE_KEYS = [ROOM_SET_DECK_KEY, ROOM_JOIN_KEY, ROOM_SET_STATE_KEY] as const;

export interface RoomUpdatePublishArgs {
  [ROOM_UPDATES_BY_ROOM_SLUG_TOPIC]: [slug: string, payload: RoomUpdateBase];
}

export interface RoomUpdateBase {
  operation: typeof ROOM_UPDATE_KEYS[number];
  value: BackingRoom;
}

export const Room = objectType({
  name: 'Room',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('ownerId');
    t.id('deckId');
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
    t.id('userIdOfLastAddedOccupantForSubscription', {
      resolve({ userIdOfLastAddedOccupantForSubscription }) {
        return userIdOfLastAddedOccupantForSubscription ?? null;
      },
      description: `guaranteed to be set only as part of the top-level RoomUpdate payload yielded by a subscription to roomUpdatesBySlug triggered by a successful ${ROOM_JOIN_KEY}`,
    });
    t.field('userOfLastAddedOccupantForSubscription', {
      type: 'User',
      resolve({ userIdOfLastAddedOccupantForSubscription }, _args, { prisma }) {
        if (userIdOfLastAddedOccupantForSubscription) {
          return prisma.user.findUnique({
            where: { id: userIdOfLastAddedOccupantForSubscription },
          });
        }
        return null;
      },
      description: `guaranteed to be set only as part of the top-level RoomUpdate payload yielded by a subscription to roomUpdatesBySlug triggered by a successful ${ROOM_JOIN_KEY}`,
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

export const RoomBySlugQuery = queryField('roomBySlug', {
  type: nonNull('Room'),
  args: { slug: nonNull(stringArg()) },
  resolve: guardValidUser(async (_source, { slug }, { prisma, sub }) => {
    const res = await prisma.room.findUnique({
      where: { slug, ownerId: sub.id },
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
        slug: genSlug(),
      },
    });
  }),
});

// Only legal when room state is WAITING
export const RoomSetDeckMutation = mutationField(ROOM_SET_DECK_KEY, {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
    deckId: nonNull(idArg()),
  },
  description: `@triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, { id: roomId, deckId }, { prisma, pubsub, sub }) => {
    const roomRes = await roomSetDeck(prisma, { roomId, deckId, currentUserId: sub.id });
    if (roomRes.slug) {
      pubsub.publish(ROOM_UPDATES_BY_ROOM_SLUG_TOPIC, roomRes.slug, {
        operation: ROOM_SET_DECK_KEY,
        value: roomRes,
      });
    }
    return roomRes;
  }),
});

export const RoomSetStateMutation = mutationField(ROOM_SET_STATE_KEY, {
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
  resolve: guardValidUser(async (_parent, { id, state }, { prisma, pubsub, redis, sub }) => {
    let previousRoom: PRoom | null | undefined;
    if (WillNotServeRoomStates.includes(state)) {
      previousRoom = await prisma.room.findUnique({ where: { id } });
    }
    const roomRes = await roomSetState(prisma, {
      id,
      state,
      currentUserId: sub.id,
    });
    const slug = roomRes.slug ?? previousRoom?.slug;
    if (slug) {
      await invalidateByRoomSlug(redis, slug);
      pubsub.publish(ROOM_UPDATES_BY_ROOM_SLUG_TOPIC, slug, {
        operation: ROOM_SET_STATE_KEY,
        value: roomRes,
      });
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
export const RoomJoinMutation = mutationField(ROOM_JOIN_KEY, {
  type: nonNull('Room'),
  args: {
    id: nonNull(idArg()),
  },
  description: `@invalidatesTokens(
    reason: "occupying existing room"
  )
  @triggersSubscriptions(
    signatures: ["activeRoomUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, { id }, { prisma, pubsub, sub }) => {
    const roomRes = await roomAddOccupant(prisma, {
      roomId: id,
      occupantId: sub.id,
    });
    if (roomRes.slug) {
      pubsub.publish(ROOM_UPDATES_BY_ROOM_SLUG_TOPIC, roomRes.slug, {
        operation: ROOM_JOIN_KEY,
        value: { ...roomRes, userIdOfLastAddedOccupantForSubscription: sub.id },
      });
    }
    return roomRes;
  }),
});

export const RoomUpdateOperation = enumType({
  name: 'RoomUpdateOperation',
  members: ROOM_UPDATE_KEYS,
});

export const RoomUpdate = objectType({
  name: 'RoomUpdate',
  definition(t) {
    t.nonNull.field('operation', {
      type: 'RoomUpdateOperation',
    });
    t.nonNull.field('value', {
      type: 'Room',
    });
  },
});

export const RoomUpdatesByRoomSlugSubscription = subscriptionField('roomUpdatesByRoomSlug', {
  type: nonNull('RoomUpdate'),
  args: {
    slug: nonNull(stringArg()),
  },
  subscribe: guardValidUser((_parent, { slug }, { pubsub, sub }, _info) => {
    if (!sub.occupyingActiveRoomSlugs[slug]) {
      throw userLacksPermissionsErrorFactory();
    }
    return pubsub.subscribe(ROOM_UPDATES_BY_ROOM_SLUG_TOPIC, slug);
  }),
  resolve(parent: RoomUpdateBase) {
    return parent;
  },
});
