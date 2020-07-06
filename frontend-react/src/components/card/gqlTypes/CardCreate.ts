/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardCreate
// ====================================================

export interface CardCreate_cardCreate_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface CardCreate_cardCreate {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: any;
  readonly template: boolean;
  readonly deck: CardCreate_cardCreate_deck | null;
}

export interface CardCreate {
  readonly cardCreate: CardCreate_cardCreate | null;
}

export interface CardCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
}
