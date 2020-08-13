import type { JsonValue, UserDeckRecord } from "@prisma/client";

// UserDeckRecordStoredScalars
export interface UserDeckRecordSS extends Partial<UserDeckRecord> {
  id: string;
  userId: string;
  deckId: string;
  notes: JsonValue;

  createdAt: Date;
  updatedAt: Date;
}
