import { Prisma } from "@prisma/client";
import { enumType, idArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus";
import { RoomState as GeneratedRoomState } from "../../generated/typescript-operations";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { guardValidUser } from "../service/authorization/guardValidUser";
import { roomAddOccupant, roomEditOwnerConfig, roomSetDeck, roomSetState } from "../service/room";
import { slug } from "../util";
import { jsonObjectArg } from "./scalarUtil";

export const Room = objectType({
  name: "Room",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("ownerId");
    t.id("deckId");
    t.nonNull.jsonObject("ownerConfig", {
      resolve({ ownerConfig }) {
        return ownerConfig as Prisma.JsonObject;
      },
    });
    t.nonNull.jsonObject("internalConfig", {
      resolve({ internalConfig }) {
        return internalConfig as Prisma.JsonObject;
      },
    });
    t.nonNull.field("state", {
      type: "RoomState",
    });

    t.nonNull.field("owner", {
      type: "User",
      async resolve({ ownerId }, _args, { prisma }) {
        const user = await prisma.user.findUnique({ where: { id: ownerId } });
        if (user === null) {
          throw new Error(`Could not find user with id ${ownerId}`);
        }
        return user;
      },
    });
    t.field("deck", {
      type: "Deck",
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
    t.nonNull.list.nonNull.field("occupants", {
      type: "User",
      resolve({ id }, _args, { prisma }) {
        return prisma.user.findMany({ where: { occupyingRooms: { some: { roomId: id } } } });
      },
    });
    t.nonNull.int("occupantCount", {
      resolve({ id }, _args, { prisma }) {
        return prisma.occupant.count({ where: { roomId: id } });
      },
    });
    t.nonNull.list.nonNull.field("messages", {
      type: "Message",
      resolve({ id }, _args, { prisma }) {
        return prisma.message.findMany({ where: { roomId: id } });
      },
    });
    t.nonNull.int("messageCount", {
      resolve({ id }, _args, { prisma }) {
        return prisma.message.count({ where: { roomId: id } });
      },
    });
  },
});

export const RoomState = enumType({
  name: "RoomState",
  members: ["WAITING", "SERVING", "SERVED"],
});

export const RoomQuery = queryField("room", {
  type: nonNull("Room"),
  args: { id: nonNull(idArg()) },
  resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => {
    const res = await prisma.room.findUnique({
      where: { id, ownerId: sub.id },
    });
    if (!res) {
      throw userLacksPermissionsErrorFactory();
    }
    return res;
  }),
});

export const OccupyingRoomsQuery = queryField("occupyingRooms", {
  type: nonNull(list(nonNull("Room"))),
  resolve: guardValidUser((_source, _args, { sub, prisma }) => prisma.room.findMany({
    where: { occupants: { some: { id: sub.id } } },
  })),
});

export const RoomCreateMutation = mutationField("roomCreate", {
  type: nonNull("Room"),
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  resolve: guardValidUser((_parent, _args, { sub, prisma }) => {
    const { id } = sub;
    return prisma.room.create({
      data: {
        owner: { connect: { id } },
        occupants: { create: { occupantId: id } },
        state: GeneratedRoomState.Waiting,
        slug: slug(),
      },
    });
  }),
});

// Only legal when room state is WAITING
export const RoomSetDeckMutation = mutationField("roomSetDeck", {
  type: nonNull("Room"),
  args: {
    id: nonNull(idArg()),
    deckId: nonNull(idArg()),
  },
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  resolve: guardValidUser(async (_parent, { id: roomId, deckId }, { prisma, sub }) => roomSetDeck(prisma, { roomId, deckId, currentUserId: sub.id })),
});

// Only legal when room state is WAITING
export const RoomEditOwnerConfigMutation = mutationField("roomEditOwnerConfig", {
  type: nonNull("Room"),
  args: {
    id: nonNull(idArg()),
    ownerConfig: nonNull(jsonObjectArg()),
  },
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  async resolve(_parent, { id, ownerConfig }, { prisma }) {
    return roomEditOwnerConfig(prisma, { id, ownerConfig: ownerConfig as Prisma.InputJsonObject });
  },
});

export const RoomSetStateMutation = mutationField("roomSetState", {
  type: nonNull("Room"),
  args: {
    id: nonNull(idArg()),
    state: nonNull("RoomState"),
  },
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  resolve: guardValidUser((_parent, { id, state }, { prisma, sub }) => roomSetState(prisma, { id, state: state as GeneratedRoomState, currentUserId: sub.id })),
});

export const RoomCleanUpDeadMutation = mutationField("roomCleanUpDead", {
  type: nonNull("Int"),
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  resolve() {
    throw Error("not implemented yet");
  },
});

// Only legal when room state is WAITING
export const RoomAddOccupantMutation = mutationField("roomAddOccupant", {
  type: nonNull("Room"),
  args: {
    id: nonNull(idArg()),
    occupantId: nonNull(idArg()),
  },
  description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
  resolve: guardValidUser((_parent, { id, occupantId }, { prisma, sub }) => roomAddOccupant(prisma, { roomId: id, occupantId, currentUserId: sub.id })),
});
