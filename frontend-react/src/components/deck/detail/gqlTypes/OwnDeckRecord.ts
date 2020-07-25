/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnDeckRecord
// ====================================================

export interface OwnDeckRecord_ownDeckRecord {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: Json;
}

export interface OwnDeckRecord {
  readonly ownDeckRecord: OwnDeckRecord_ownDeckRecord | null;
}

export interface OwnDeckRecordVariables {
  readonly deckId: string;
}
