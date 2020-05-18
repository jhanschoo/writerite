import { Card, PrismaClient } from "@prisma/client";

// CardStoredScalars
export interface CardSS extends Partial<Card> {
  id: string;
  deckId: string;
  prompt: string;
  fullAnswer: string;
  // note: graphQL return type for answers is (string | null)[] | null
  answers: string[];
  // TODO: investigate how Prisma handles null elements in the array
  sortKey: string;
  editedAt: Date;
  template: boolean;
}

export function cardsOfDeckTopic(userId: string, deckId: string): string {
  return `card:deck::${deckId}:deckOwner::${userId}`;
}
export async function userOwnsCard({ prisma, userId, cardId }: {
  prisma: PrismaClient;
  userId?: string | null;
  cardId?: string | null;
}): Promise<boolean> {
  if (!userId || !cardId) {
    return false;
  }
  return (await prisma.card.findMany({
    select: { id: true },
    where: {
      id: cardId,
      deck: { ownerId: userId },
    },
    first: 1,
  })).length === 1;
}
