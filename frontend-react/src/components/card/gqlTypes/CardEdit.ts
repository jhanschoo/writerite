/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardEdit
// ====================================================

export interface CardEdit_cardEdit_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface CardEdit_cardEdit {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: any;
  readonly template: boolean;
  readonly deck: CardEdit_cardEdit_deck | null;
}

export interface CardEdit {
  readonly cardEdit: CardEdit_cardEdit | null;
}

export interface CardEditVariables {
  readonly id: string;
  readonly prompt?: string | null;
  readonly fullAnswer?: string | null;
  readonly sortKey?: string | null;
  readonly answers?: ReadonlyArray<string> | null;
  readonly template?: boolean | null;
}
