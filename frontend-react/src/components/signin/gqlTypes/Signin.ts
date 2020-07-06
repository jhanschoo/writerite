/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Signin
// ====================================================

export interface Signin_signin {
  readonly __typename: "AuthResponse";
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
