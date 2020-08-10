/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckDetailQuery
// ====================================================

export interface DeckDetailQuery_deck_subdecks {
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

export interface DeckDetailQuery_deck_ownRecord {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: GraphQLJSON;
}

export interface DeckDetailQuery_deck {
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
  readonly subdecks: ReadonlyArray<(DeckDetailQuery_deck_subdecks | null)> | null;
  readonly ownRecord: DeckDetailQuery_deck_ownRecord | null;
}

export interface DeckDetailQuery {
  readonly deck: DeckDetailQuery_deck | null;
}

export interface DeckDetailQueryVariables {
  readonly id: string;
}
