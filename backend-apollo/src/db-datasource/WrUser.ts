import { Concrete, RecordOfKeys } from "../types";

export const WR_USER_COLS = [
  "id",
  "email",
  "name",
  "passwordHash",
  "googleId",
  "facebookId",
  "roles",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_USER = "WrBUser" as const;
export interface WrBUser {
  id: string;
  email?: string;
  name?: string | null;
  passwordHash?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  roles?: string[];
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

export interface WrUserEditParams {
  id: string;
  name?: string;
}

export interface WrUserDataSource<TUser extends WrBUser=WrBUser> {
  getWrUser(id: string): Promise<TUser | undefined>;
  getWrUsersFromName(name: string): Promise<TUser[]>;
  getWrUserFromEmail(email: string): Promise<TUser | undefined>;
  getWrUsersFromOccupiedRoomId(roomId: string): Promise<TUser[]>;
  editWrUser(params: WrUserEditParams): Promise<TUser | undefined>;
}
