/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardsCreate
// ====================================================

export interface CardsCreate_cardsCreate_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface CardsCreate_cardsCreate {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: any;
  readonly template: boolean;
  readonly deck: CardsCreate_cardsCreate_deck | null;
}

export interface CardsCreate {
  readonly cardsCreate: ReadonlyArray<(CardsCreate_cardsCreate | null)> | null;
}

export interface CardsCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
  readonly multiplicity: number;
}
