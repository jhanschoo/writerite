import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { RoomSS } from "../model/Room";
import { UserSS, userToSS } from "../model/User";
import { ChatMsgSS, chatMsgToSS } from "../model/ChatMsg";

export interface RoomConfig {
  deckId?: string;
  deckName?: string;
  deckNameLang?: string;
  roundLength?: number;
  clientDone?: boolean;
}

interface RoomResolver extends IResolverObject<RoomSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // ownerId uses default resolver

  // archived uses default resolver

  // config uses default resolver

  inactive: FieldResolver<RoomSS, WrContext, Record<string, unknown>, boolean>;
  owner: FieldResolver<RoomSS, WrContext, Record<string, unknown>, UserSS | null>;
  occupants: FieldResolver<RoomSS, WrContext, Record<string, unknown>, (UserSS | null)[] | null>;
  chatMsgs: FieldResolver<RoomSS, WrContext, Record<string, unknown>, (ChatMsgSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Room: RoomResolver = {
  // TODO: implement outdatedness semantics in inactive field
  inactive({ archived }, _args, _ctx, _info) {
    return Promise.resolve(archived);
  },
  async owner({ ownerId }, _args, { prisma }, _info) {
    return userToSS(await prisma.user.findOne({ where: { id: ownerId } }));
  },
  async occupants({ id }, _args, { prisma }, _info) {
    return (await prisma.user.findMany({ where: { occupyingRooms: { some: { A: id } } } })).map(userToSS);
  },
  async chatMsgs({ id }, _args, { prisma }, _info) {
    return (await prisma.chatMsg.findMany({ where: { roomId: id } }))
      .map(chatMsgToSS);
  },
};
