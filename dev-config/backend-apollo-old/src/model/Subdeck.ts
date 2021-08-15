import type { Subdeck } from "@prisma/client";
import type { DeckSS } from "./Deck";

// SubdeckStoredScalars
export interface SubdeckSS extends Partial<Subdeck> {
  id: string;
  parentDeckId: string;
  subdeckId: string;

  createdAt: Date;
  updatedAt: Date;

  parentDeck?: DeckSS | null;
  subdeck?: DeckSS | null;
}
