import type { Deck, JsonValue, PrismaClient } from "@prisma/client";
import type { UserSS } from "./User";
import type { CardSS } from "./Card";
import type { UserDeckRecordSS } from "./UserDeckRecord";

// DeckStoredScalars
export interface DeckSS extends Partial<Deck> {
  id: string;
  ownerId: string;
  name: string;
  description: JsonValue;
  promptLang: string;
  answerLang: string;
  published: boolean;
  archived: boolean;
  editedAt: Date;
  usedAt: Date;

  createdAt: Date;
  updatedAt: Date;

  owner?: UserSS | null;
  subdecks?: (DeckSS | null)[] | null;
  cards?: (CardSS | null)[] | null;

  // unexposed fields
  parentDecks?: (DeckSS | null)[] | null;

  // computed values
  ownRecord?: UserDeckRecordSS | null;
}

export function ownDecksTopic(userId: string): string {
  return `deck<owner#${userId}>`;
}

export async function userOwnsDeck({
  prisma,
  userId,
  deckId,
}: {
  prisma: PrismaClient;
  userId?: string | null;
  deckId?: string | null;
}): Promise<boolean> {
  if (!userId || !deckId) {
    return false;
  }
  return (
    (await prisma.deck.count({
      where: {
        id: deckId,
        ownerId: userId,
      },
    })) === 1
  );
}
