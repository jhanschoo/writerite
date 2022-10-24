import { enumType, idArg, list, mutationField, nonNull, objectType, queryField } from "nexus";
import { userLacksPermissionsErrorFactory } from "../error";
import { guardValidUser } from "../service/authorization/guardValidUser";
import { jsonArg } from "./scalarUtil";

export const Message = objectType({
  name: "Message",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("roomId");
    t.id("senderId");
    t.nonNull.field("type", {
      type: "MessageContentType",
    });
    t.nonNull.json("content");
    t.nonNull.dateTime("createdAt");

    t.field("sender", {
      type: "User",
      async resolve({ senderId }, _args, { prisma }) {
        if (senderId === null) {
          return null;
        }
        const room = await prisma.user.findUnique({ where: { id: senderId } });
        if (room === null) {
          throw new Error(`Could not find user with id ${senderId}`);
        }
        return room;
      },
    });
    t.nonNull.field("room", {
      type: "Room",
      async resolve({ roomId }, _args, { prisma }) {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (room === null) {
          throw new Error(`Could not find room with id ${roomId}`);
        }
        return room;
      },
    });
  },
});

export const MessageContentType = enumType({
  name: "MessageContentType",
  members: ["TEXT", "CONFIG", "ROUND_START", "ROUND_WIN", "ROUND_SCORE", "CONTEST_SCORE"],
});

export const MessageQuery = queryField("message", {
  type: nonNull("Message"),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => {
    const res = await prisma.message.findFirst({ where: { id, room: { occupants: { some: { occupantId: sub.id } } } } });
    if (res === null) {
      throw userLacksPermissionsErrorFactory();
    }
    return res;
  }),
});

export const MessagesOfRoomQuery = queryField("messagesOfRoom", {
  type: nonNull(list(nonNull("Message"))),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => prisma.message.findMany({ where: { room: { id, occupants: { some: { occupantId: sub.id } } } } })),
});

export const MessageCreateMutation = mutationField("messageCreate", {
  type: nonNull("Message"),
  args: {
    roomId: nonNull(idArg()),
    type: nonNull("MessageContentType"),
    content: jsonArg(),
  },
  resolve() {
    throw Error("not implemented yet");
  },
  description: `@subscriptionsTriggered(
    signatures: ["chatMsgsOfRoomUpdates"]
  )`,
});
