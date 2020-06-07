
import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { RoomSS } from "../model/Room";
import { UserSS, userToSS } from "../model/User";
import { ChatMsgSS } from "../model/ChatMsg";

interface ChatMsgResolver extends IResolverObject<ChatMsgSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // roomId uses default resolver

  // senderId uses default resolver

  // content uses default resolver

  sender: FieldResolver<ChatMsgSS, WrContext, Record<string, unknown>, UserSS | null>;
  room: FieldResolver<ChatMsgSS, WrContext, Record<string, unknown>, RoomSS | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChatMsg: ChatMsgResolver = {
  async sender({ senderId, sender }, _args, { prisma }, _info) {
    if (sender !== undefined) {
      return sender;
    }
    if (!senderId) {
      return null;
    }
    return userToSS(await prisma.user.findOne({ where: { id: senderId } }));
  },
  room({ roomId, room }, _args, { prisma }, _info) {
    if (room !== undefined) {
      return room;
    }
    return prisma.room.findOne({ where: { id: roomId } });
  },
};
