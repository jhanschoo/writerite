import type { User } from "@prisma/client";
import type { Roles } from "../types";
import type { DeckSS } from "./Deck";
import type { RoomSS } from "./Room";
import type { ChatMsgSS } from "./ChatMsg";
import type { UserCardRecordSS } from "./UserCardRecord";
import type { UserDeckRecordSS } from "./UserDeckRecord";

// UserStoredScalars
export interface UserSS extends Partial<User> {
  id: string;
  email: string;
  facebookId: string | null;
  googleId: string | null;
  name: string | null;
  passwordHash: string | null;
  roles: Roles[];

  createdAt: Date;
  updatedAt: Date;

  decks?: (DeckSS | null)[] | null;
  ownedRooms?: (RoomSS | null)[] | null;
  occupyingRooms?: (RoomSS | null)[] | null;
  sentChatMsgs?: (ChatMsgSS | null)[] | null;
  cardRecords?: (UserCardRecordSS | null)[] | null;
  deckRecords?: (UserDeckRecordSS | null)[] | null;
}

export function userToSS(user: User): UserSS;
export function userToSS(user: User | null): UserSS | null;
export function userToSS(user: User | null): UserSS | null {
  if (user === null) {
    return null;
  }
  return {
    ...user,
    roles: user.roles as Roles[],
  };
}
