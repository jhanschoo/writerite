/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckAddSubdeck
// ====================================================

export interface DeckAddSubdeck_rwDeckAddSubdeck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckAddSubdeck {
  readonly rwDeckAddSubdeck: DeckAddSubdeck_rwDeckAddSubdeck | null;
}

export interface DeckAddSubdeckVariables {
  readonly id: string;
  readonly subdeckId: string;
}
