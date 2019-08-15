/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckCreateFromRows
// ====================================================

export interface DeckCreateFromRows_rwDeckCreateFromRows_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckCreateFromRows_rwDeckCreateFromRows_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface DeckCreateFromRows_rwDeckCreateFromRows {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckCreateFromRows_rwDeckCreateFromRows_owner;
  readonly cards: ReadonlyArray<DeckCreateFromRows_rwDeckCreateFromRows_cards>;
}

export interface DeckCreateFromRows {
  readonly rwDeckCreateFromRows: DeckCreateFromRows_rwDeckCreateFromRows | null;
}

export interface DeckCreateFromRowsVariables {
  readonly name?: string | null;
  readonly nameLang?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly rows: ReadonlyArray<ReadonlyArray<string>>;
}
