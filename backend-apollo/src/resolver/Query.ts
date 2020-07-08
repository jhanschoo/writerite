import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { UserSS, userToSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";
import { RoomSS, userOccupiesRoom, roomToSS } from "../model/Room";
import { ChatMsgSS, chatMsgToSS, userSeesChatMsg } from "../model/ChatMsg";

interface QueryResolver extends IResolverObject<Record<string, unknown>, WrContext> {
  user: FieldResolver<Record<string, unknown>, WrContext, { id: string }, UserSS | null>;
  deck: FieldResolver<Record<string, unknown>, WrContext, { id: string }, DeckSS | null>;
  ownedDecks: FieldResolver<Record<string, unknown>, WrContext, {
    cursor?: string | null,
    take?: number | null,
    titleFilter?: string | null,
  }, (DeckSS | null)[] | null>;
  participatedDecks: FieldResolver<Record<string, unknown>, WrContext, {
    cursor?: string | null,
    take?: number | null,
    titleFilter?: string | null,
  }, (DeckSS | null)[] | null>;
  visibleDecks: FieldResolver<Record<string, unknown>, WrContext, {
    cursor?: string | null,
    take?: number | null,
    titleFilter?: string | null,
  }, (DeckSS | null)[] | null>;
  card: FieldResolver<Record<string, unknown>, WrContext, { id: string }, CardSS | null>;
  cardsOfDeck: FieldResolver<Record<string, unknown>, WrContext, { deckId: string }, (CardSS | null)[] | null>;
  room: FieldResolver<Record<string, unknown>, WrContext, { id: string }, RoomSS | null>;
  occupiedRooms: FieldResolver<Record<string, unknown>, WrContext, Record<string, unknown>, (RoomSS | null)[] | null>;
  chatMsg: FieldResolver<Record<string, unknown>, WrContext, { id: string }, ChatMsgSS | null>;
  chatMsgsOfRoom: FieldResolver<Record<string, unknown>, WrContext, { roomId: string }, (ChatMsgSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  async ownedDecks(_parent, { cursor, take, titleFilter }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      return await prisma.deck.findMany({ where: { ownerId: sub.id } });
    } catch (e) {
      return null;
    }
  },
  async participatedDecks(_parent, { cursor, take, titleFilter }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      return await prisma.deck.findMany({ where: { ownerId: sub.id } });
    } catch (e) {
      return null;
    }
  },
  async visibleDecks(_parent, { cursor, take, titleFilter }, { sub, prisma }, _info) {
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
      return roomToSS(await prisma.room.findOne({ where: { id } }));
    } catch (e) {
      return null;
    }
  },
  async occupiedRooms(_parent, _args, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      return (await prisma.room.findMany({ where: { occupants: { some: { B: sub.id } } } })).map(roomToSS);
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
