/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckEdit
// ====================================================

export interface DeckEdit_rwDeckEdit_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckEdit_rwDeckEdit_subdecks {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckEdit_rwDeckEdit_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface DeckEdit_rwDeckEdit {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckEdit_rwDeckEdit_owner;
  readonly subdecks: ReadonlyArray<DeckEdit_rwDeckEdit_subdecks>;
  readonly cards: ReadonlyArray<DeckEdit_rwDeckEdit_cards>;
}

export interface DeckEdit {
  readonly rwDeckEdit: DeckEdit_rwDeckEdit | null;
}

export interface DeckEditVariables {
  readonly id: string;
  readonly name?: string | null;
  readonly nameLang?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
}
