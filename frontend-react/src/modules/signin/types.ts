export interface WrUser {
  readonly id: string;
  readonly email: string;
  readonly roles: string[];
}

export interface UserAndToken {
  readonly token: string;
  readonly user: WrUser;
}

export type OptionalUserAndToken = UserAndToken | null;
