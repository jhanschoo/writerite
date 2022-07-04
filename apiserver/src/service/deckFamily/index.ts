import { Deck, PrismaClient } from "@prisma/client";

// Returns a list of decks that are descendants (reflexive) of the deck with the provided deck id.
export async function getDescendantsOfDeck(prisma: PrismaClient, deckId: string): Promise<Deck[]> {
  let frontier = [deckId];
  const seen: Record<string, Deck> = {};
  while (frontier.length) {
    const frontierObjects = await prisma.deck.findMany({
      include: {
        subdecks: {
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
    for (const { subdecks, ...deck } of frontierObjects) {
      seen[deck.id] = deck;
    }
    frontier = frontierObjects.flatMap(({ subdecks }) => subdecks.map(({ subdeckId }) => subdeckId)).filter((id) => !(id in seen));
  }
  return Object.values(seen);
}
