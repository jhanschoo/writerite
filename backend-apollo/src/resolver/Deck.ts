import type { IResolverObject } from "apollo-server-koa";

import type { FieldResolver, WrContext } from "../types";

import { UserSS, userToSS } from "../model/User";
import type { DeckSS } from "../model/Deck";
import type { CardSS } from "../model/Card";
import type { UserDeckRecordSS } from "../model/UserDeckRecord";

interface DeckResolver extends IResolverObject<DeckSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // ownerId uses default resolver

  // name uses default resolver

  // description uses default resolver

  // promptLang uses default resolver

  // answerLang uses default resolver

  // published uses default resolver

  // archived uses default resolver

  // editedAt uses plugin resolver

  // usedAt uses plugin resolver

  owner: FieldResolver<DeckSS, WrContext, Record<string, unknown>, UserSS | null>;
  subdecks: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;
  cards: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (CardSS | null)[] | null>;
  ownRecord: FieldResolver<DeckSS, WrContext, Record<string, unknown>, UserDeckRecordSS | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Deck: DeckResolver = {
  async owner({ ownerId, owner }, _args, { prisma }, _info) {
    if (owner !== undefined) {
      return owner;
    }
    return userToSS(await prisma.user.findOne({ where: { id: ownerId } }));
  },
  subdecks({ id, subdecks }, _args, { prisma }, _info) {
    if (subdecks !== undefined) {
      return subdecks;
    }
    return prisma.deck.findMany({ where: { parentDecks: { some: { parentDeckId: id } } } });
  },
  cards({ id, cards }, _args, { prisma }, _info) {
    if (cards !== undefined) {
      return cards;
    }
    return prisma.card.findMany({ where: { deckId: id } });
  },
  ownRecord({ id, ownRecord }, _args, { prisma, sub }, _info) {
    if (ownRecord !== undefined) {
      return ownRecord;
    }
    const userId = sub?.id;
    if (!userId) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return prisma.userDeckRecord.findOne({ where: { userId_deckId: { userId, deckId: id } } });
  },
};
