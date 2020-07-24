import type { UserCardRecord } from "@prisma/client";
import type { CardSS } from "./Card";
import type { UserSS } from "./User";

// UserCardRecordStoredScalars
export interface UserCardRecordSS extends Partial<UserCardRecord> {
  id: string;
  userId: string;
  cardId: string;
  correctRecord: Date[];

  createdAt: Date;
  updatedAt: Date;

  user?: (UserSS | null)[] | null;
  card?: (CardSS | null)[] | null;
}
