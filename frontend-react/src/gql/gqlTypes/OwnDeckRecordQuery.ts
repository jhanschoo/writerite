/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnDeckRecordQuery
// ====================================================

export interface OwnDeckRecordQuery_ownDeckRecord {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: GraphQLJSON;
}

export interface OwnDeckRecordQuery {
  readonly ownDeckRecord: OwnDeckRecordQuery_ownDeckRecord | null;
}

export interface OwnDeckRecordQueryVariables {
  readonly deckId: string;
}
