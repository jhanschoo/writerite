import type { IResolverObject } from "apollo-server-koa";

import type { FieldResolver, WrContext } from "../types";

import { UserSS, userToSS } from "../model/User";
import type { DeckSS } from "../model/Deck";
import type { CardSS } from "../model/Card";

interface DeckResolver extends IResolverObject<DeckSS, WrContext, Record<string, unknown>> {
  // id uses default resolver

  // ownerId uses default resolver

  // name uses default resolver

  // description uses default resolver

  // promptLang uses default resolver

  // answerLang uses default resolver

  // published uses default resolver

  // usedAt uses plugin resolver

  // editedAt uses plugin resolver

  owner: FieldResolver<DeckSS, WrContext, Record<string, unknown>, UserSS | null>;
  parents: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;
  children: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;
  cards: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (CardSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Deck: DeckResolver = {
  async owner({ ownerId, owner }, _args, { prisma }, _info) {
    if (owner !== undefined) {
      return owner;
    }
    return userToSS(await prisma.user.findOne({ where: { id: ownerId } }));
  },
  parents({ id, parents }, _args, { prisma }, _info) {
    if (parents !== undefined) {
      return parents;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return prisma.deck.findMany({ where: { subdecks: { some: { B: id } } } });
  },
  children({ id, children }, _args, { prisma }, _info) {
    if (children !== undefined) {
      return children;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return prisma.deck.findMany({ where: { parentDeck: { some: { A: id } } } });
  },
  cards({ id, cards }, _args, { prisma }, _info) {
    if (cards !== undefined) {
      return cards;
    }
    return prisma.card.findMany({ where: { deckId: id } });
  },
};
