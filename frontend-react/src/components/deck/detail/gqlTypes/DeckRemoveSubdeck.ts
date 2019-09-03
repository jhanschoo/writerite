/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckRemoveSubdeck
// ====================================================

export interface DeckRemoveSubdeck_rwDeckAddSubdeck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckRemoveSubdeck {
  readonly rwDeckAddSubdeck: DeckRemoveSubdeck_rwDeckAddSubdeck | null;
}

export interface DeckRemoveSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
