/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserEdit
// ====================================================

export interface UserEdit_userEdit {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface UserEdit {
  readonly userEdit: UserEdit_userEdit | null;
}

export interface UserEditVariables {
  readonly name: string;
}
