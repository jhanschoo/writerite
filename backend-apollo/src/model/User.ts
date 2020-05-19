import { User } from "@prisma/client";
import { Roles } from "../types";
import { DeckSS } from "./Deck";
import { RoomSS } from "./Room";

// UserStoredScalars
export interface UserSS extends Partial<User> {
  id: string;
  email: string;
  roles: Roles[];
  name: string | null;

  decks?: (DeckSS | null)[] | null;
  ownedRooms?: (RoomSS | null)[] | null;
  occupiedRooms?: (RoomSS | null)[] | null;
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
