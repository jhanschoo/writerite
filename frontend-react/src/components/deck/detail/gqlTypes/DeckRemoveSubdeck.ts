/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckRemoveSubdeck
// ====================================================

export interface DeckRemoveSubdeck_rwDeckRemoveSubdeck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckRemoveSubdeck {
  readonly rwDeckRemoveSubdeck: DeckRemoveSubdeck_rwDeckRemoveSubdeck | null;
}

export interface DeckRemoveSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
