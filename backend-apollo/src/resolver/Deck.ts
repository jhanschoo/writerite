import type { IResolverObject } from "apollo-server-koa";
import type { PrismaClient } from "@prisma/client";

import type { FieldResolver, WrContext } from "../types";

import type { UserSS } from "../model/User";
import type { DeckSS } from "../model/Deck";
import type { CardSS } from "../model/Card";

interface DeckResolver extends IResolverObject<DeckSS, WrContext, object> {
  // id uses default resolver

  // ownerId uses default resolver

  // name uses default resolver

  // description uses default resolver

  // promptLang uses default resolver

  // answerLang uses default resolver

  // published uses default resolver

  owner: FieldResolver<DeckSS, WrContext, object, UserSS | null>;
  parents: FieldResolver<DeckSS, WrContext, object, (DeckSS | null)[] | null>;
  children: FieldResolver<DeckSS, WrContext, object, (DeckSS | null)[] | null>;
  cards: FieldResolver<DeckSS, WrContext, object, (CardSS | null)[] | null>;
}

export const Deck: DeckResolver = {
  owner({ ownerId }, _args, { prisma }, _info) {
    return prisma.user.findOne({ where: { id: ownerId } });
  },
  parents({ id }, _args, { prisma }, _info) {
    return prisma.deck.findMany({ where: { subdecks: { some: { B: id } } } });
  },
  children({ id }, _args, { prisma }, _info) {
    return prisma.deck.findMany({ where: { subdecks: { some: { A: id } } } });
  },
  cards({ id }, _args, { prisma }, _info) {
    return prisma.card.findMany({ where: { deckId: id } });
  },
};
