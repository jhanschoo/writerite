import { IResolverObject } from "apollo-server-koa";
import { FieldResolver, WrContext } from "../types";
import { UserSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { RoomSS, roomToSS } from "../model/Room";

interface UserResolver extends IResolverObject<UserSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // email uses default resolver

  // name uses default resolver

  // roles uses default resolver

  decks: FieldResolver<UserSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;

  ownedRooms: FieldResolver<UserSS, WrContext, Record<string, unknown>, (RoomSS | null)[] | null>;

  occupyingRooms: FieldResolver<UserSS, WrContext, Record<string, unknown>, (RoomSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User: UserResolver = {
  decks({ id, decks }, _args, { prisma, sub }, _info) {
    const subId = sub?.id;
    if (id !== subId) {
      return null;
    }
    if (decks !== undefined) {
      return decks;
    }
    return prisma.deck.findMany({ where: { ownerId: id } });
  },
  async ownedRooms({ id, ownedRooms }, _args, { prisma, sub }, _info) {
    const subId = sub?.id;
    if (id !== subId) {
      return null;
    }
    if (ownedRooms !== undefined) {
      return ownedRooms;
    }
    return (await prisma.room.findMany({ where: { ownerId: id } })).map(roomToSS);
  },
  async occupyingRooms({ id, occupyingRooms }, _args, { prisma, sub }, _info) {
    const subId = sub?.id;
    if (id !== subId) {
      return null;
    }
    if (occupyingRooms !== undefined) {
      return occupyingRooms;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return (await prisma.room.findMany({ where: { occupants: { some: { occupantId: id } } } })).map(roomToSS);
  },
};
