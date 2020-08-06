/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckDetail
// ====================================================

export interface DeckDetail_deck_subdecks {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: GraphQLJSON;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: GraphQLDateTime;
  readonly editedAt: GraphQLDateTime;
}

export interface DeckDetail_deck_ownRecord {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: GraphQLJSON;
}

export interface DeckDetail_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: GraphQLJSON;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: GraphQLDateTime;
  readonly editedAt: GraphQLDateTime;
  readonly subdecks: ReadonlyArray<(DeckDetail_deck_subdecks | null)> | null;
  readonly ownRecord: DeckDetail_deck_ownRecord | null;
}

export interface DeckDetail {
  readonly deck: DeckDetail_deck | null;
}

export interface DeckDetailVariables {
  readonly deckId: string;
}
