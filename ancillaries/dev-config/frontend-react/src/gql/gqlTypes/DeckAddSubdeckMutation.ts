/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckAddSubdeckMutation
// ====================================================

export interface DeckAddSubdeckMutation_deckAddSubdeck_subdecks {
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

export interface DeckAddSubdeckMutation_deckAddSubdeck {
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
  readonly subdecks: ReadonlyArray<DeckAddSubdeckMutation_deckAddSubdeck_subdecks | null> | null;
}

export interface DeckAddSubdeckMutation {
  readonly deckAddSubdeck: DeckAddSubdeckMutation_deckAddSubdeck | null;
}

export interface DeckAddSubdeckMutationVariables {
  readonly id: string;
  readonly subdeckId: string;
}
