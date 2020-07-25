import type { Card, JsonObject, JsonValue, PrismaClient } from "@prisma/client";
import type { DeckSS } from "./Deck";
import type { UserCardRecordSS } from "./UserCardRecord";

export interface CardCreateInput {
  prompt: JsonObject;
  fullAnswer: JsonObject;
  answers: string[];
  sortKey?: string;
  template?: boolean;
}

// CardStoredScalars
export interface CardSS extends Partial<Card> {
  id: string;
  deckId: string;
  prompt: JsonValue;
  fullAnswer: JsonValue;
  // note: graphQL return type for answers is (string | null)[] | null
  answers: string[];
  // TODO: investigate how Prisma handles null elements in the array
  sortKey: string;
  template: boolean;
  editedAt: Date;

  createdAt: Date;
  updatedAt: Date;

  deck?: DeckSS | null;
  records?: (UserCardRecordSS | null)[] | null;

  // computed values
  ownRecord?: UserCardRecordSS | null;
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
