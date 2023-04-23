import { builder } from '../../builder';
import { getDescendantsOfDeck } from '../../service/deck';
import { Card } from '../Card';
import { Deck } from '../Deck';

builder.objectFields(Deck, (t) => ({
  cardsAllUnder: t.prismaConnection({
    type: Card,
    cursor: 'id',
    description:
      'all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck',
    async resolve(query, { id }, _args, { prisma }) {
      const decks = await getDescendantsOfDeck(prisma, id);
      return prisma.card.findMany({
        ...query,
        where: { deckId: { in: decks.map(({ id }) => id) } },
      });
    },
  }),
}));
