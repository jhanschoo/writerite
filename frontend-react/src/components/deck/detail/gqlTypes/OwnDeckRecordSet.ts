/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OwnDeckRecordSet
// ====================================================

export interface OwnDeckRecordSet_ownDeckRecordSet {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: Json;
}

export interface OwnDeckRecordSet {
  readonly ownDeckRecordSet: OwnDeckRecordSet_ownDeckRecordSet | null;
}

export interface OwnDeckRecordSetVariables {
  readonly deckId: string;
  readonly notes?: JsonObject | null;
}
