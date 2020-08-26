/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckUsedMutation
// ====================================================

export interface DeckUsedMutation_deckUsed {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: GraphQLJSON;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly archived: boolean;
  readonly usedAt: GraphQLDateTime;
  readonly editedAt: GraphQLDateTime;
}

export interface DeckUsedMutation {
  readonly deckUsed: DeckUsedMutation_deckUsed | null;
}

export interface DeckUsedMutationVariables {
  readonly id: string;
}
