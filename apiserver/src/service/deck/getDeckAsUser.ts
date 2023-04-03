import { PrismaClient } from "@prisma/client";

type Props = [
  PrismaClient,
  {
    userId: string;
    deckId: string;
  }
];

export function getDeckAsUser(...[prisma, { userId, deckId }]: Props) {
  return prisma.deck.findUnique({
    where: {
      id: deckId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      OR: [
        { ownerId: userId },
        { cards: { some: { records: { some: { userId } } } } },
        { published: true },
      ],
    },
  });
}
