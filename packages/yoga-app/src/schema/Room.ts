import { decodeGlobalID } from '@pothos/plugin-relay';
import { Room as PRoom, RoomType, RoundState, Unit } from 'database';

import { builder, gao, ungao } from '../builder';
import { ROOM_UPDATES_BY_ROOMID_TOPIC } from '../service/room';
import { invalidateByRoomId, invalidateByUserId } from '../service/session';
import { slug as genSlug } from '../util';
import { Round } from './Round';
import { User } from './User';

export enum RoomUpdateOperations {
  ROOM_SET_DECK = 'roomSetDeck',
  ROOM_JOIN = 'roomJoin',
  ROOM_START_ROUND = 'roomStartRound',
  ROOM_END_ROUND = 'roomEndRound',
  ROOM_ARCHIVE = 'roomArchive',
}

export interface RoomUpdateShape {
  operation: RoomUpdateOperations;
  value: PRoom;
}

export interface RoomUpdatePublishArgs {
  [ROOM_UPDATES_BY_ROOMID_TOPIC]: [slug: string, payload: RoomUpdateShape];
}

builder.enumType(RoomUpdateOperations, {
  name: 'RoomUpdateOperations',
  description: 'Keys identifying operations that trigger room updates.',
});

builder.enumType(RoomType, {
  name: 'RoomType',
});

export const PSUMMARY = gao('getPublicInfo');
export const PDETAIL = gao('getDetailInfo');

// note that persistent rooms rely on the type not being accessible from the graph
// except by its occupants in the first place for access control.
// PERSSISTENT_PERMS is the minimal set of permissions that a user has on persistent rooms.
const PERSISTENT_PERMS = ungao([PSUMMARY, PDETAIL]);
// OCCUPANT_PERMS is the minimal set of permissions that an occupant of an active ephemeral room has on that room.
const OCCUPANT_PERMS = ungao([PSUMMARY, PDETAIL]);
// PUBLIC_PERMS is the minimal set of permissions that a user has on a room.
const PUBLIC_PERMS = ungao([PSUMMARY]);

export const Room = builder.prismaNode('Room', {
  authScopes: {
    authenticated: true,
  },
  grantScopes: ({ id, type }, { sub }) => {
    if (type === RoomType.PERSISTENT) {
      return PERSISTENT_PERMS;
    }
    if (Object.keys(sub?.occupyingRoomSlugs || {}).includes(id)) {
      return OCCUPANT_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: 'id' },
  fields: (t) => ({
    messages: t
      .withAuth(PDETAIL)
      .relatedConnection('chatMsgs', {
        cursor: 'id',
        description: 'Messages sent in this room, ordered from latest to earliest.',
        query: (args, ctx) => {
          return {
            orderBy: { createdAt: 'desc' },
          };
        },
      }),
    messageCount: t.withAuth(PDETAIL).relationCount('chatMsgs'),
    occupantsCount: t.withAuth(PDETAIL).relationCount('occupants'),
    occupants: t.withAuth(PDETAIL).field({
      select: (_args, _ctx, nestedSelection) => ({
        occupants: {
          select: {
            occupant: nestedSelection(true),
          },
        },
      }),
      type: [User],
      resolve: (room) => room.occupants.map((o) => o.occupant),
    }),
    activeRound: t.withAuth(PDETAIL).field({
      select: (_args, _ctx, nestedSelection) => ({
        rounds: nestedSelection({
          where: { isActive: Unit.UNIT },
        }),
      }),
      type: Round,
      nullable: true,
      resolve: (room) => room.rounds[0] ?? null,
    }),
    type: t.expose('type', { type: RoomType }),
  }),
});

builder.queryFields((t) => ({
  room: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _root, { id }, { prisma }) => {
      id = decodeGlobalID(id as string).id;
      return await prisma.room.findUnique({
        ...query,
        where: { id },
      });
    },
  }),
  roomBySlug: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      slug: t.arg.string({ required: true }),
    },
    nullable: true,
    resolve: async (query, _root, { slug }, { prisma }) => {
      return await prisma.room.findFirst({
        ...query,
        where: { rounds: { some: { isActive: Unit.UNIT, slug } } },
      });
    },
  }),
  persistentRoomByOccupants: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      otherOccupantIds: t.arg.idList({ required: true }),
    },
    nullable: true,
    resolve: async (query, _root, { otherOccupantIds }, { prisma, sub }) => {
      const occupantsBareIds = otherOccupantIds.map((id) =>
        decodeGlobalID(id as string).id
      ).concat(sub.bareId);
      const occupantsObjs = occupantsBareIds.map((occupantId) => ({ occupantId }));
      const occupantsClause = occupantsObjs.map((occupantIdObj) => ({
        occupants: { some: occupantIdObj },
      }));
      const existingRoom = await prisma.room.findFirst({
        ...query,
        where: {
          type: RoomType.PERSISTENT,
          AND: [
            { occupants: { every: { occupantId: { in: occupantsBareIds } } } },
            ...occupantsClause,
          ],
        }
      });
      if (existingRoom) {
        return existingRoom;
      }
      const newRoom = await prisma.room.create({
        ...query,
        data: {
          type: RoomType.PERSISTENT,
          occupants: {
            createMany: {
              data: occupantsObjs,
              skipDuplicates: true
            }
          }
        },
      });
      return newRoom;
    },
  }),
  deckPersistentRoomByDeckId: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      deckId: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _root, { deckId }, { prisma, sub }) => {
      const deckBareId = decodeGlobalID(deckId as string).id;
      const existingRoom = await prisma.room.findFirst({
        where: {
          type: RoomType.DECK_PERSISTENT,
          rounds: { some: { isActive: Unit.UNIT, deckId: deckBareId } },
        }
      });
      if (existingRoom) {
        return prisma.room.update({
          ...query,
          where: { id: existingRoom.id },
          data: {
            occupants: {
              upsert: {
                where: { roomId_occupantId: { roomId: existingRoom.id, occupantId: sub.bareId } },
                create: { occupantId: sub.bareId },
                update: {},
              },
            },
          },
        });
      }
      const newRoom = await prisma.room.create({
        ...query,
        data: {
          type: RoomType.DECK_PERSISTENT,
          occupants: {
            create: {
              occupantId: sub.bareId,
            },
          },
          rounds: {
            create: {
              deckId: deckBareId,
              slug: genSlug(),
              isActive: Unit.UNIT,
              state: RoundState.PLAYING,
            },
          },
        },
      });
      // TODO: queue a quizconductor
      return newRoom;
    },
  }),
  occupyingUnarchivedEphemeralRooms: t.withAuth({ authenticated: true }).prismaField({
    type: [Room],
    nullable: true,
    resolve: async (query, _root, _args, { prisma, sub }) => {
      return await prisma.room.findMany({
        ...query,
        where: {
          type: RoomType.EPHEMERAL,
          occupants: {
            some: {
              occupantId: sub.bareId,
            },
          },
          archived: false,
        },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  roomCreate: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    directives: {
      invalidatesTokens: true,
    },
    resolve: async (query, _root, _args, { prisma, redis, sub }) => {
      await invalidateByUserId(redis, sub.bareId);
      const res = await prisma.room.create({
        ...query,
        data: {
          occupants: {
            create: {
              occupantId: sub.bareId,
            },
          },
        },
      });
      sub.occupyingRoomSlugs[res.id] = null;
      return res;
    },
  }),
  roomJoin: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
    },
    directives: {
      invalidatesTokens: true,
    },
    resolve: async (query, _root, { id }, { pubsub, prisma, redis, sub }) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.room.update({
        ...query,
        where: {
          id,
          archived: false,
          occupants: {
            some: {
              occupant: {
                befrienderIn: {
                  some: { befriendedId: sub.bareId },
                },
                befriendedIn: {
                  some: { befrienderId: sub.bareId },
                },
              },
            },
          },
        },
        data: {
          occupants: {
            create: {
              occupantId: sub.bareId,
            },
          },
        },
      });
      await invalidateByUserId(redis, sub.bareId);
      sub.occupyingRoomSlugs[res.id] = null;
      pubsub.publish(ROOM_UPDATES_BY_ROOMID_TOPIC, res.id, {
        operation: RoomUpdateOperations.ROOM_JOIN,
        value: res,
      });
      return res;
    },
  }),
  roomSetDeck: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
      deckId: t.arg.id({ required: true }),
    },
    authScopes: (_root, { id }) => {
      return {
        authenticated: true,
        inRoomId: id,
      };
    },
    resolve: async (query, _root, { id, deckId }, { pubsub, prisma, sub }) => {
      id = decodeGlobalID(id as string).id;
      deckId = decodeGlobalID(deckId as string).id;
      const res = await prisma.room.update({
        ...query,
        where: {
          id,
          occupants: {
            some: {
              occupantId: sub.bareId,
            },
          },
          OR: [
            { rounds: { none: { isActive: Unit.UNIT } } },
            {
              rounds: {
                some: { isActive: Unit.UNIT, state: RoundState.WAITING },
              },
            },
          ],
        },
        data: {
          rounds: {
            upsert: {
              where: {
                isActive_roomId: { isActive: Unit.UNIT, roomId: id },
              },
              update: { deckId },
              create: {
                slug: genSlug(),
                deckId,
                isActive: Unit.UNIT,
              },
            },
          },
        },
      });
      pubsub.publish(ROOM_UPDATES_BY_ROOMID_TOPIC, res.id, {
        operation: RoomUpdateOperations.ROOM_SET_DECK,
        value: res,
      });
      return res;
    },
  }),
  roomStartRound: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, { pubsub, prisma, sub }) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.room.update({
        ...query,
        where: {
          id,
          occupants: {
            some: {
              occupantId: sub.bareId,
            },
          },
          rounds: {
            some: {
              isActive: Unit.UNIT,
              state: RoundState.WAITING,
            },
          },
        },
        data: {
          rounds: {
            update: {
              where: {
                isActive_roomId: { isActive: Unit.UNIT, roomId: id },
              },
              data: {
                state: RoundState.PLAYING,
              },
            },
          },
        },
      });
      pubsub.publish(ROOM_UPDATES_BY_ROOMID_TOPIC, res.id, {
        operation: RoomUpdateOperations.ROOM_START_ROUND,
        value: res,
      });
      return res;
    },
  }),
  roomEndRound: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, { pubsub, prisma, redis, sub }) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.room.update({
        ...query,
        where: {
          id,
          occupants: {
            some: {
              occupantId: sub.bareId,
            },
          },
          rounds: {
            some: {
              isActive: Unit.UNIT,
              state: RoundState.PLAYING,
            },
          },
        },
        data: {
          rounds: {
            update: {
              where: {
                isActive_roomId: { isActive: Unit.UNIT, roomId: id },
              },
              data: {
                isActive: null,
              },
            },
          },
        },
      });
      pubsub.publish(ROOM_UPDATES_BY_ROOMID_TOPIC, res.id, {
        operation: RoomUpdateOperations.ROOM_END_ROUND,
        value: res,
      });
      return res;
    },
  }),
  roomArchive: t.withAuth({ authenticated: true }).prismaField({
    type: Room,
    args: {
      id: t.arg.id({ required: true }),
    },
    directives: {
      invalidatesTokens: true,
    },
    resolve: async (query, _root, { id }, { pubsub, prisma, redis, sub }) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.room.update({
        ...query,
        where: {
          id,
          occupants: {
            some: {
              occupantId: sub.bareId,
            },
          },
          archived: false,
          rounds: { none: { isActive: Unit.UNIT } },
        },
        data: { archived: true },
      });
      pubsub.publish(ROOM_UPDATES_BY_ROOMID_TOPIC, res.id, {
        operation: RoomUpdateOperations.ROOM_ARCHIVE,
        value: res,
      });
      await invalidateByRoomId(redis, id);
      return res;
    },
  }),
}));

export const RoomUpdate = builder
  .objectRef<RoomUpdateShape>('RoomUpdate')
  .implement({
    description: 'A message indicating an operation performed on a room.',
    fields: (t) => ({
      operation: t.field({
        type: RoomUpdateOperations,
        resolve: (root) => root.operation,
      }),
      value: t.field({
        type: Room,
        resolve: (root) => root.value,
      }),
    }),
  });

builder.subscriptionFields((t) => ({
  roomUpdatesByRoomId: t.withAuth({ authenticated: true }).field({
    type: RoomUpdate,
    args: {
      id: t.arg.id({ required: true }),
    },
    authScopes: (_root, { id }) => {
      return {
        authenticated: true,
        inRoomId: id,
      };
    },
    subscribe: (_root, { id }, { pubsub }) => {
      id = decodeGlobalID(id as string).id;
      return pubsub.subscribe(ROOM_UPDATES_BY_ROOMID_TOPIC, id);
    },
    resolve(parent: RoomUpdateShape) {
      return parent;
    },
  }),
}));
