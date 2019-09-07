/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserEdit
// ====================================================

export interface UserEdit_rwUserEdit {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface UserEdit {
  readonly rwUserEdit: UserEdit_rwUserEdit | null;
}

export interface UserEditVariables {
  readonly name: string;
}
