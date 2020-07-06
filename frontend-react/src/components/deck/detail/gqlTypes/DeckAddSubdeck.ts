/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckAddSubdeck
// ====================================================

export interface DeckAddSubdeck_deckAddSubdeck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckAddSubdeck {
  readonly deckAddSubdeck: DeckAddSubdeck_deckAddSubdeck | null;
}

export interface DeckAddSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
