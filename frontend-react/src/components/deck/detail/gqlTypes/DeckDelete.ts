/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckDelete
// ====================================================

export interface DeckDelete_deckDelete {
  readonly __typename: "Deck";
  readonly id: string;
}

export interface DeckDelete {
  readonly deckDelete: DeckDelete_deckDelete | null;
}

export interface DeckDeleteVariables {
  readonly id: string;
}
