/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OwnDecksUpdates
// ====================================================

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created_owner;
  readonly cards: ReadonlyArray<OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created_cards>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated {
  readonly __typename: "RwDeckCreated";
  readonly created: OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated_created | null;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated_owner;
  readonly cards: ReadonlyArray<OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated_cards>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated {
  readonly __typename: "RwDeckUpdated";
  readonly updated: OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated_updated | null;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_RwDeckDeleted {
  readonly __typename: "RwDeckDeleted";
  readonly deletedId: string | null;
}

export type OwnDecksUpdates_rwOwnDecksUpdates = OwnDecksUpdates_rwOwnDecksUpdates_RwDeckCreated | OwnDecksUpdates_rwOwnDecksUpdates_RwDeckUpdated | OwnDecksUpdates_rwOwnDecksUpdates_RwDeckDeleted;

export interface OwnDecksUpdates {
  readonly rwOwnDecksUpdates: OwnDecksUpdates_rwOwnDecksUpdates;
}
