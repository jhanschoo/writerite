import type { Deck, JsonValue, PrismaClient } from "@prisma/client";
import type { UserSS } from "./User";
import type { CardSS } from "./Card";
import { UserDeckRecordSS } from "./UserDeckRecord";

// DeckStoredScalars
export interface DeckSS extends Partial<Deck> {
  id: string;
  ownerId: string;
  name: string;
  description: JsonValue;
  promptLang: string;
  answerLang: string;
  published: boolean;
  usedAt: Date;
  editedAt: Date;

  owner?: UserSS | null;
  parents?: (DeckSS | null)[] | null;
  children?: (DeckSS | null)[] | null;
  cards?: (CardSS | null)[] | null;

  // computed values
  ownRecord?: UserDeckRecordSS | null;
}

export function ownDecksTopic(userId: string): string {
  return `deck:owner::${userId}`;
}

export async function userOwnsDeck({ prisma, userId, deckId }: {
  prisma: PrismaClient;
  userId?: string | null;
  deckId?: string | null;
}): Promise<boolean> {
  if (!userId || !deckId) {
    return false;
  }
  return await prisma.deck.count({
    where: {
      id: deckId,
      ownerId: userId,
    },
  }) === 1;
}
