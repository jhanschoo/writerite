export interface CurrentUser {
  readonly email: string;
  readonly id: string;
  readonly roles: string[];
}

export interface UserAndToken {
  readonly token: string;
  readonly user: CurrentUser;
}

export type OptionalUserAndToken = UserAndToken | null;
