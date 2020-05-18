import { Deck, PrismaClient } from "@prisma/client";

// DeckStoredScalars
export interface DeckSS extends Partial<Deck> {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  promptLang: string;
  answerLang: string;
  published: boolean;
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
  return (await prisma.deck.findMany({
    select: { id: true },
    where: {
      id: deckId,
      ownerId: userId,
    },
    first: 1,
  })).length === 1;
}
