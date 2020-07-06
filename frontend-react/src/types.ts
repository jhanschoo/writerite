export enum Roles {
  user = "user",
  admin = "admin",
  wright = "wright",
}

export interface CurrentUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<Roles>;
}

export interface CurrentUserAndToken {
  readonly token: string;
  readonly user: CurrentUser;
}

export type FixRef<T extends { ref?: any }> = Omit<T, 'ref'> & { ref?: Exclude<T['ref'], string> };
