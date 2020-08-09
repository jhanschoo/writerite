/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckRemoveSubdeckMutation
// ====================================================

export interface DeckRemoveSubdeckMutation_deckRemoveSubdeck_subdecks {
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

export interface DeckRemoveSubdeckMutation_deckRemoveSubdeck {
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
  readonly subdecks: ReadonlyArray<(DeckRemoveSubdeckMutation_deckRemoveSubdeck_subdecks | null)> | null;
}

export interface DeckRemoveSubdeckMutation {
  readonly deckRemoveSubdeck: DeckRemoveSubdeckMutation_deckRemoveSubdeck | null;
}

export interface DeckRemoveSubdeckMutationVariables {
  readonly id: string;
  readonly subdeckId: string;
}
