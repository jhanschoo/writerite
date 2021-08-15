import type { UserCardRecord } from "@prisma/client";

// UserCardRecordStoredScalars
export interface UserCardRecordSS extends Partial<UserCardRecord> {
  id: string;
  userId: string;
  cardId: string;
  correctRecord: Date[];

  createdAt: Date;
  updatedAt: Date;
}
