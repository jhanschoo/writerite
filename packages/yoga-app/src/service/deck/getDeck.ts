import { PrismaClient } from 'database';

type Props = [
  PrismaClient,
  {
    deckId: string;
  }
];

export function getDeck(...[prisma, { deckId }]: Props) {
  return prisma.deck.findUnique({
    where: {
      id: deckId,
    },
  });
}
