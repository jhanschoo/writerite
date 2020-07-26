import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";
import type { UserCardRecordSS } from "../model/UserCardRecord";
import { Unit } from "@prisma/client";

interface CardResolver extends IResolverObject<CardSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // deckId uses default resolver

  // prompt uses default resolver

  // fullAnswer uses default resolver

  // answers uses default resolver

  // sortKey uses default resolver

  // template uses default resolver

  // editedAt uses default resolver

  mainTemplate: FieldResolver<CardSS, WrContext, Record<string, unknown>, boolean>;
  deck: FieldResolver<CardSS, WrContext, Record<string, unknown>, DeckSS | null>;
  ownRecord: FieldResolver<CardSS, WrContext, Record<string, unknown>, UserCardRecordSS | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Card: CardResolver = {
  mainTemplate({ default: defaultField }, _args, _ctx, _info) {
    return defaultField === Unit.UNIT;
  },
  deck(card, _args, { prisma }, _info) {
    return prisma.deck.findOne({ where: { id: card.deckId } });
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
    return prisma.userCardRecord.findOne({ where: { userId_cardId: { userId, cardId: id } } });
  },
};
