import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { RoomSS } from "../model/Room";
import { UserSS, userToSS } from "../model/User";
import { ChatMsgSS, chatMsgToSS } from "../model/ChatMsg";

interface RoomResolver extends IResolverObject<RoomSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // ownerId uses default resolver

  // ownerConfig uses default resolver

  // internalConfig uses default resolver

  // state uses default resolver

  owner: FieldResolver<RoomSS, WrContext, Record<string, unknown>, UserSS | null>;
  occupants: FieldResolver<RoomSS, WrContext, Record<string, unknown>, (UserSS | null)[] | null>;
  chatMsgs: FieldResolver<RoomSS, WrContext, Record<string, unknown>, (ChatMsgSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Room: RoomResolver = {
  async owner({ ownerId, owner }, _args, { prisma }, _info) {
    if (owner !== undefined) {
      return owner;
    }
    return userToSS(await prisma.user.findOne({ where: { id: ownerId } }));
  },
  async occupants({ id, occupants }, _args, { prisma }, _info) {
    if (occupants !== undefined) {
      return occupants;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return (await prisma.user.findMany({ where: { occupyingRooms: { some: { A: id } } } })).map(userToSS);
  },
  async chatMsgs({ id, chatMsgs }, _args, { prisma }, _info) {
    if (chatMsgs !== undefined) {
      return chatMsgs;
    }
    return (await prisma.chatMsg.findMany({ where: { roomId: id } }))
      .map(chatMsgToSS);
  },
};
