import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { UserSS, userToSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";
import { RoomSS, userOccupiesRoom } from "../model/Room";
import { ChatMsgSS, chatMsgToSS, userSeesChatMsg } from "../model/ChatMsg";

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
  async user(_parent, { id }, { prisma }, _info) {
    try {
      return userToSS(await prisma.user.findOne({ where: { id } }));
    } catch (e) {
      return null;
    }
  },
  async deck(_parent, { id }, { prisma }, _info) {
    try {
      return await prisma.deck.findOne({ where: { id } });
    } catch (e) {
      return null;
    }
  },
  async ownDecks(_parent, _args, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      return await prisma.deck.findMany({ where: { ownerId: sub.id } });
    } catch (e) {
      return null;
    }
  },
  async card(_parent, { id }, { prisma }, _info) {
    try {
      return await prisma.card.findOne({ where: { id } });
    } catch (e) {
      return null;
    }
  },
  async cardsOfDeck(_parent, { deckId }, { prisma }, _info) {
    try {
      return await prisma.card.findMany({ where: { deckId } });
    } catch (e) {
      return null;
    }
  },
  async room(_parent, { id }, { prisma }, _info) {
    try {
      return await prisma.room.findOne({ where: { id } });
    } catch (e) {
      return null;
    }
  },
  async occupiedRooms(_parent, _args, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      return await prisma.room.findMany({ where: { occupants: { some: { B: sub.id } } } });
    } catch (e) {
      return null;
    }
  },
  async chatMsg(_parent, { id }, { sub, prisma }, _info) {
    try {
      if (!sub || !await userSeesChatMsg({ prisma, userId: sub.id, chatMsgId: id })) {
        return null;
      }
      return chatMsgToSS(await prisma.chatMsg.findOne({ where: { id } }));
    } catch (e) {
      return null;
    }
  },
  async chatMsgsOfRoom(_parent, { roomId }, { sub, prisma }, _info) {
    try {
      if (!sub || !await userOccupiesRoom({ prisma, userId: sub.id, roomId })) {
        return null;
      }
      return (await prisma.chatMsg.findMany({ where: { roomId } })).map(chatMsgToSS);
    } catch (e) {
      return null;
    }
  },
};
