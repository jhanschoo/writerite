/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardsCreate
// ====================================================

export interface CardsCreate_rwCardsCreate_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardsCreate_rwCardsCreate {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardsCreate_rwCardsCreate_deck;
}

export interface CardsCreate {
  readonly rwCardsCreate: ReadonlyArray<CardsCreate_rwCardsCreate> | null;
}

export interface CardsCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
  readonly multiplicity: number;
}
