
import type { UserCardRecord } from "@prisma/client";

// UserCardRecordStoredScalars
export interface UserCardRecordSS extends Partial<UserCardRecord> {
  userId: string;
  cardId: string;
  correctRecord: Date[];
}
