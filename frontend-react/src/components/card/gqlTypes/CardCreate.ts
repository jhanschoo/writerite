/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardCreate
// ====================================================

export interface CardCreate_rwCardCreate_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardCreate_rwCardCreate {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardCreate_rwCardCreate_deck;
}

export interface CardCreate {
  readonly rwCardCreate: CardCreate_rwCardCreate | null;
}

export interface CardCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
}
