/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardEdit
// ====================================================

export interface CardEdit_rwCardEdit_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardEdit_rwCardEdit {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardEdit_rwCardEdit_deck;
}

export interface CardEdit {
  readonly rwCardEdit: CardEdit_rwCardEdit | null;
}

export interface CardEditVariables {
  readonly id: string;
  readonly prompt?: string | null;
  readonly fullAnswer?: string | null;
  readonly sortKey?: string | null;
  readonly answers?: ReadonlyArray<string> | null;
  readonly template?: boolean | null;
}
