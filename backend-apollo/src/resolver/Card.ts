import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, WrContext } from "../types";

import { DeckSS } from "../model/Deck";
import { CardSS } from "../model/Card";

interface CardResolver extends IResolverObject<CardSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // deckId uses default resolver

  // prompt uses default resolver

  // fullAnswer uses default resolver

  // answers uses default resolver

  // sortKey uses default resolver

  // editedAt uses default resolver

  // template uses default resolver

  deck: FieldResolver<CardSS, WrContext, Record<string, unknown>, DeckSS | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Card: CardResolver = {
  deck(card, _args, { prisma }, _info) {
    return prisma.deck.findOne({ where: { id: card.deckId } });
  },
};
