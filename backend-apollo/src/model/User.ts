import { User } from "@prisma/client";
import { Roles } from "../types";

// UserStoredScalars
export interface UserSS extends Partial<User> {
  id: string;
  email: string;
  roles: Roles[];
  name: string | null;
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
