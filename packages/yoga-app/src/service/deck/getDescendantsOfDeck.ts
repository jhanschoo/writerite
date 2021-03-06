import { Deck, PrismaClient } from 'database';

// Returns a list of decks that are descendants (reflexive) of the deck with the provided deck id.

export async function getDescendantsOfDeck(
  prisma: PrismaClient,
  deckId: string
): Promise<Deck[]> {
  let frontier = [deckId];
  const seen: Record<string, Deck> = {};
  while (frontier.length) {
    const frontierObjects = await prisma.deck.findMany({
      include: {
        parentDeckIn: {
          select: {
            subdeckId: true,
          },
        },
      },
      where: {
        id: {
          in: frontier,
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const { parentDeckIn, ...deck } of frontierObjects) {
      seen[deck.id] = deck;
    }
    frontier = frontierObjects
      .flatMap(({ parentDeckIn }) =>
        parentDeckIn.map(({ subdeckId }) => subdeckId)
      )
      .filter((id) => !(id in seen));
  }
  return Object.values(seen);
}
