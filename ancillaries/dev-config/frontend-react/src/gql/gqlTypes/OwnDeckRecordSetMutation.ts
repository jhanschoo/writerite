/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OwnDeckRecordSetMutation
// ====================================================

export interface OwnDeckRecordSetMutation_ownDeckRecordSet {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: GraphQLJSON;
}

export interface OwnDeckRecordSetMutation {
  readonly ownDeckRecordSet: OwnDeckRecordSetMutation_ownDeckRecordSet | null;
}

export interface OwnDeckRecordSetMutationVariables {
  readonly deckId: string;
  readonly notes?: GraphQLJSONObject | null;
}
