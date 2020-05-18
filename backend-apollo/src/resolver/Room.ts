import { IResolverObject } from "apollo-server-koa";
import { PrismaClient } from "@prisma/client";

import { FieldResolver, WrContext } from "../types";

import { RoomSS } from "../model/Room";
import { UserSS } from "../model/User";
import { ChatMsgSS, chatMsgToSS } from "../model/ChatMsg";

export interface RoomConfig {
  deckId?: string;
  deckName?: string;
  deckNameLang?: string;
  roundLength?: number;
  clientDone?: boolean;
}

interface RoomResolver extends IResolverObject<RoomSS, WrContext, object> {
  // id uses default resolver

  // ownerId uses default resolver

  // archived uses default resolver

  // config uses default resolver

  inactive: FieldResolver<RoomSS, WrContext, object, boolean>;
  owner: FieldResolver<RoomSS, WrContext, object, UserSS | null>;
  occupants: FieldResolver<RoomSS, WrContext, object, (UserSS | null)[] | null>;
  chatMsgs: FieldResolver<RoomSS, WrContext, object, (ChatMsgSS | null)[] | null>;
}

export const Room: RoomResolver = {
  // TODO: implement outdatedness semantics in inactive field
  inactive({ archived }, _args, _ctx, _info) {
    return Promise.resolve(archived);
  },
  owner({ ownerId }, _args, { prisma }, _info) {
    return prisma.user.findOne({ where: { id: ownerId } });
  },
  occupants({ id }, _args, { prisma }, _info) {
    return prisma.user.findMany({ where: { occupyingRooms: { some: { A: id } } } });
  },
  async chatMsgs({ id }, _args, { prisma }, _info) {
    return (await prisma.chatMsg.findMany({ where: { roomId: id } }))
      .map(chatMsgToSS);
  },
};