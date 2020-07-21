import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { UserSS, userToSS } from "../model/User";
import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";
import { RoomSS, roomToSS, userOccupiesRoom } from "../model/Room";
import { ChatMsgSS, chatMsgToSS, userSeesChatMsg } from "../model/ChatMsg";
import { UserDeckRecordSS } from "../model/UserDeckRecord";
import { UserCardRecordSS } from "../model/UserCardRecord";

const DEFAULT_TAKE = 60;

enum DecksQueryScope {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OWNED = "OWNED",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PARTICIPATED = "PARTICIPATED",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  VISIBLE = "VISIBLE",
}

function cursorParams(cursor?: string | null, take?: number | null): {
  cursor: { id: string },
  skip: number,
  take: number,
} | {
  take: number
} {
  const actualTake = Math.min(take ?? DEFAULT_TAKE, DEFAULT_TAKE);
  if (cursor) {
    return {
      cursor: { id: cursor },
      skip: 1,
      take: actualTake + 1,
    };
  }
  return {
    take: actualTake,
  };
}

interface QueryResolver extends IResolverObject<Record<string, unknown>, WrContext> {
  user: FieldResolver<Record<string, unknown>, WrContext, { id: string }, UserSS | null>;
  deck: FieldResolver<Record<string, unknown>, WrContext, { id: string }, DeckSS | null>;
  decks: FieldResolver<Record<string, unknown>, WrContext, {
    cursor?: string | null,
    take?: number | null,
    titleFilter?: string | null,
    scope?: DecksQueryScope | null,
  }, (DeckSS | null)[] | null>;
  ownDeckRecord: FieldResolver<Record<string, unknown>, WrContext, { deckId: string }, UserDeckRecordSS | null>;
  card: FieldResolver<Record<string, unknown>, WrContext, { id: string }, CardSS | null>;
  cardsOfDeck: FieldResolver<Record<string, unknown>, WrContext, { deckId: string }, (CardSS | null)[] | null>;
  ownCardRecord: FieldResolver<Record<string, unknown>, WrContext, { cardId: string }, UserCardRecordSS | null>;
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
  async deck(_parent, { id }, { prisma, sub }, _info) {
    if (!sub) {
      return null;
    }
    try {
      const OR = [
        { ownerId: sub.id },
        { cards: { some: { records: { some: { userId: sub.id } } } } },
        { published: true },
      ];
      const decks = await prisma.deck.findMany({ where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR, id,
      } });
      if (decks.length !== 1) {
        return null;
      }
      return decks[0];
    } catch (e) {
      return null;
    }
  },
  async decks(_parent, { cursor, take, titleFilter, scope }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      const OR = [
        { ownerId: sub.id },
        { cards: { some: { records: { some: { userId: sub.id } } } } },
        { published: true },
      ];
      switch (scope) {
        case DecksQueryScope.PARTICIPATED:
          OR.length = 2;
          break;
        case DecksQueryScope.VISIBLE:
          OR.length = 3;
          break;
        case DecksQueryScope.OWNED:
          // falls through
        default:
          OR.length = 1;
      }
      const decks = await prisma.deck.findMany({
        ...cursorParams(cursor, take),
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          OR,
          name: titleFilter ? {
            contains: titleFilter,
          } : undefined,
        },
        include: {
          owner: true,
          cards: true,
          subdecks: true,
        },
      });
      return decks.map((deck) => ({
        ...deck,
        owner: userToSS(deck.owner),
      }));
    } catch (e) {
      return null;
    }
  },
  async ownDeckRecord(_parent, { deckId }, { prisma, sub }, _info) {
    if (!sub) {
      return null;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      return await prisma.userDeckRecord.findOne({ where: { userId_deckId: { userId: sub.id, deckId } } });
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
  async ownCardRecord(_parent, { cardId }, { prisma, sub }, _info) {
    if (!sub) {
      return null;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      return await prisma.userCardRecord.findOne({ where: { userId_cardId: { userId: sub.id, cardId } } });
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
