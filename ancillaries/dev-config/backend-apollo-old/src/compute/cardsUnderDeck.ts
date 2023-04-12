import { Card, PrismaClient } from "@prisma/client";

// Further work: filtering of cards may be implemented
export const cardsUnderDeck = async ({
  id: rootDeckId,
  prisma,
}: {
  id: string;
  prisma: PrismaClient;
}): Promise<Card[]> => {
  const processed = new Set([rootDeckId]);
  const cards: { [id: string]: Card } = {};
  const aux = async (deckId: string): Promise<void> => {
    const currentCards = await prisma.card.findMany({
      where: { deckId },
    });
    for (const card of currentCards) {
      cards[card.id] = card;
    }
    let subdecks = await prisma.deck.findMany({
      select: { id: true },
      where: { parentDecks: { some: { parentDeckId: deckId } } },
    });
    subdecks = subdecks.filter(({ id }) => !processed.has(id));
    for (const { id } of subdecks) {
      processed.add(id);
    }
    return Promise.all(subdecks.map(({ id }) => aux(id))).then(() => undefined);
  };
  await aux(rootDeckId);
  return Object.values(cards);
};
