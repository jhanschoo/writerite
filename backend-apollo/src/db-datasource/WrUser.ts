import type { Concrete, RecordOfKeys } from "../types";

export const WR_USER_COLS = [
  "id",
  "email",
  "roles",
  "name",
  "passwordHash",
  "googleId",
  "facebookId",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_USER = "WrBUser" as const;
export interface WrBUser {
  id: string;
  email?: string;
  roles?: string[];
  name?: string | null;
  passwordHash?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_USER = "WrDUser" as const;
export type WrDUser = Concrete<WrBUser> & RecordOfKeys<typeof WR_USER_COLS>;

/**
 * @param bUser
 * @returns
 */
export function isWrDUser(bUser: WrBUser): bUser is WrDUser {
  for (const key of WR_USER_COLS) {
    if (bUser[key] === undefined) {
      return false;
    }
  }
  return true;
}
