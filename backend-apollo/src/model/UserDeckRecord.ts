import type { JsonValue, UserDeckRecord } from "@prisma/client";

// UserDeckRecordStoredScalars
export interface UserDeckRecordSS extends Partial<UserDeckRecord> {
  userId: string;
  deckId: string;
  notes: JsonValue;
}
