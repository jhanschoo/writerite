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

  owner: FieldResolver<DeckSS, WrContext, Record<string, unknown>, UserSS | null>;
  parents: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;
  children: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (DeckSS | null)[] | null>;
  cards: FieldResolver<DeckSS, WrContext, Record<string, unknown>, (CardSS | null)[] | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Deck: DeckResolver = {
  async owner({ ownerId }, _args, { prisma }, _info) {
    return userToSS(await prisma.user.findOne({ where: { id: ownerId } }));
  },
  parents({ id }, _args, { prisma }, _info) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return prisma.deck.findMany({ where: { subdecks: { some: { B: id } } } });
  },
  children({ id }, _args, { prisma }, _info) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return prisma.deck.findMany({ where: { subdecks: { some: { A: id } } } });
  },
  cards({ id }, _args, { prisma }, _info) {
    return prisma.card.findMany({ where: { deckId: id } });
  },
};
