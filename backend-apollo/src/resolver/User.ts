import { IResolverObject } from "apollo-server-koa";
import { FieldResolver, WrContext } from "../types";
import { UserSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { RoomSS } from "../model/Room";

interface UserResolver extends IResolverObject<UserSS, WrContext, object> {
  // id uses default resolver

  // email uses default resolver

  // roles uses default resolver

  // name uses default resolver

  decks: FieldResolver<UserSS, WrContext, object, (DeckSS | null)[] | null>;

  ownedRooms: FieldResolver<UserSS, WrContext, object, (RoomSS | null)[] | null>;

  occupiedRooms: FieldResolver<UserSS, WrContext, object, (RoomSS | null)[] | null>;
}

export const User: UserResolver = {
  decks({ id }, _args, { prisma }, _info) {
    return prisma.deck.findMany({ where: { ownerId: id } });
  },
  ownedRooms({ id }, _args, { prisma }, _info) {
    return prisma.room.findMany({ where: { ownerId: id } });
  },
  occupiedRooms({ id }, _args, { prisma }, _info) {
    return prisma.room.findMany({ where: { occupants: { some: { B: id } } } });
  },
};
