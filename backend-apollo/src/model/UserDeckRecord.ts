import type { JsonValue, UserDeckRecord } from "@prisma/client";
import type { DeckSS } from "./Deck";
import type { UserSS } from "./User";

// UserDeckRecordStoredScalars
export interface UserDeckRecordSS extends Partial<UserDeckRecord> {
  id: string;
  userId: string;
  deckId: string;
  notes: JsonValue;

  createdAt: Date;
  updatedAt: Date;

  user?: (UserSS | null)[] | null;
  deck?: (DeckSS | null)[] | null;
}
