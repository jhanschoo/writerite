/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SigninMutation
// ====================================================

export interface SigninMutation_signin {
  readonly __typename: "AuthResponse";
  readonly token: string;
}

export interface SigninMutation {
  readonly signin: SigninMutation_signin | null;
}

export interface SigninMutationVariables {
  readonly email: string;
  readonly name?: string | null;
  readonly token: string;
  readonly authorizer: string;
  readonly identifier: string;
}
