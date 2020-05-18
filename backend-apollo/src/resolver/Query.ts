import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { UserSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";
import { RoomSS } from "../model/Room";
import { ChatMsgSS, chatMsgToSS } from "../model/ChatMsg";

interface QueryResolver extends IResolverObject<object, WrContext> {
  user: FieldResolver<object, WrContext, { id: string }, UserSS | null>;
  deck: FieldResolver<object, WrContext, { id: string }, DeckSS | null>;
  ownDecks: FieldResolver<object, WrContext, object, (DeckSS | null)[] | null>;
  card: FieldResolver<object, WrContext, { id: string }, CardSS | null>;
  cardsOfDeck: FieldResolver<object, WrContext, { deckId: string }, (CardSS | null)[] | null>;
  room: FieldResolver<object, WrContext, { id: string }, RoomSS | null>;
  occupiedRooms: FieldResolver<object, WrContext, object, (RoomSS | null)[] | null>;
  chatMsg: FieldResolver<object, WrContext, { id: string }, ChatMsgSS | null>;
  chatMsgsOfRoom: FieldResolver<object, WrContext, { roomId: string }, (ChatMsgSS | null)[] | null>;
}

export const Query: QueryResolver = {
  user(_parent, { id }, { prisma }, _info) {
    return prisma.user.findOne({ where: { id } });
  },
  deck(_parent, { id }, { prisma }, _info) {
    return prisma.deck.findOne({ where: { id } });
  },
  ownDecks(_parent, _args, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    return prisma.deck.findMany({ where: { ownerId: sub.id } });
  },
  card(_parent, { id }, { prisma }, _info) {
    return prisma.card.findOne({ where: { id } });
  },
  cardsOfDeck(_parent, { deckId }, { prisma }, _info) {
    return prisma.card.findMany({ where: { deckId } });
  },
  room(_parent, { id }, { prisma }, _info) {
    return prisma.room.findOne({ where: { id } });
  },
  occupiedRooms(_parent, _args, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    return prisma.room.findMany({ where: { occupants: { some: { B: sub.id } } } });
  },
  async chatMsg(_parent, { id }, { prisma }, _info) {
    return chatMsgToSS(await prisma.chatMsg.findOne({ where: { id } }));
  },
  async chatMsgsOfRoom(_parent, { roomId }, { prisma }, _info) {
    return (await prisma.chatMsg.findMany({ where: { roomId } })).map(chatMsgToSS);
  },
};
