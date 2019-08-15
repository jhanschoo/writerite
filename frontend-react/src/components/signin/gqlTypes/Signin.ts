/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Signin
// ====================================================

export interface Signin_signin_user {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface Signin_signin {
  readonly __typename: "RwAuthResponse";
  readonly user: Signin_signin_user;
  readonly token: string;
}

export interface Signin {
  readonly signin: Signin_signin | null;
}

export interface SigninVariables {
  readonly email: string;
  readonly name?: string | null;
  readonly token: string;
  readonly authorizer: string;
  readonly identifier: string;
}
