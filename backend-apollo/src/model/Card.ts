import type { Card, PrismaClient } from "@prisma/client";
import type { DeckSS } from "./Deck";

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

  deck?: DeckSS | null;
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
  return await prisma.card.count({
    where: {
      id: cardId,
      deck: { ownerId: userId },
    },
  }) === 1;
}
