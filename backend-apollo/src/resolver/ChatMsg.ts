
import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { RoomSS } from "../model/Room";
import { UserSS } from "../model/User";
import { ChatMsgSS } from "../model/ChatMsg";

interface ChatMsgResolver extends IResolverObject<ChatMsgSS, WrContext, object> {
  // id uses default resolver

  // roomId uses default resolver

  // senderId uses default resolver

  // content uses default resolver

  sender: FieldResolver<ChatMsgSS, WrContext, object, UserSS | null>;
  room: FieldResolver<ChatMsgSS, WrContext, object, RoomSS | null>;
}

export const ChatMsg: ChatMsgResolver = {
  sender({ senderId }, _args, { prisma }, _info) {
    if (!senderId) {
      return null;
    }
    return prisma.user.findOne({ where: { id: senderId } });
  },
  room({ roomId }, _args, { prisma }, _info) {
    return prisma.room.findOne({ where: { id: roomId } });
  },
};
