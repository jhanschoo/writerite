/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckAddSubdeck
// ====================================================

export interface DeckAddSubdeck_deckAddSubdeck_subdecks {
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

export interface DeckAddSubdeck_deckAddSubdeck {
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
  readonly subdecks: ReadonlyArray<(DeckAddSubdeck_deckAddSubdeck_subdecks | null)> | null;
}

export interface DeckAddSubdeck {
  readonly deckAddSubdeck: DeckAddSubdeck_deckAddSubdeck | null;
}

export interface DeckAddSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
