/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnDecks
// ====================================================

export interface OwnDecks_rwOwnDecks_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecks_rwOwnDecks_subdecks {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface OwnDecks_rwOwnDecks_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface OwnDecks_rwOwnDecks {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: OwnDecks_rwOwnDecks_owner;
  readonly subdecks: ReadonlyArray<OwnDecks_rwOwnDecks_subdecks>;
  readonly cards: ReadonlyArray<OwnDecks_rwOwnDecks_cards>;
}

export interface OwnDecks {
  readonly rwOwnDecks: ReadonlyArray<OwnDecks_rwOwnDecks> | null;
}
