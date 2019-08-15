/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckCreate
// ====================================================

export interface DeckCreate_rwDeckCreate_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckCreate_rwDeckCreate_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface DeckCreate_rwDeckCreate {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckCreate_rwDeckCreate_owner;
  readonly cards: ReadonlyArray<DeckCreate_rwDeckCreate_cards>;
}

export interface DeckCreate {
  readonly rwDeckCreate: DeckCreate_rwDeckCreate | null;
}

export interface DeckCreateVariables {
  readonly name?: string | null;
  readonly nameLang?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
}
