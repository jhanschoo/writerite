export enum Roles {
  user = "user",
  admin = "admin",
  wright = "wright",
}

export interface CurrentUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: readonly Roles[];
}

export interface CurrentUserAndToken {
  readonly token: string;
  readonly user: CurrentUser;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixRef<T extends { ref?: any }> = Omit<T, "ref"> & { ref?: Exclude<T["ref"], string> };
