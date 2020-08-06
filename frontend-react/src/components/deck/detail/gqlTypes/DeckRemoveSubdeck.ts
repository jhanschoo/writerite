/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckRemoveSubdeck
// ====================================================

export interface DeckRemoveSubdeck_deckRemoveSubdeck_subdecks {
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

export interface DeckRemoveSubdeck_deckRemoveSubdeck {
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
  readonly subdecks: ReadonlyArray<(DeckRemoveSubdeck_deckRemoveSubdeck_subdecks | null)> | null;
}

export interface DeckRemoveSubdeck {
  readonly deckRemoveSubdeck: DeckRemoveSubdeck_deckRemoveSubdeck | null;
}

export interface DeckRemoveSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
