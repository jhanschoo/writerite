/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: DeckUpdates
// ====================================================

export interface DeckUpdates_rwDeckUpdates_RwDeckCreated_created_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckCreated_created_cards_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckCreated_created_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: DeckUpdates_rwDeckUpdates_RwDeckCreated_created_cards_deck;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckCreated_created {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckUpdates_rwDeckUpdates_RwDeckCreated_created_owner;
  readonly cards: ReadonlyArray<DeckUpdates_rwDeckUpdates_RwDeckCreated_created_cards>;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckCreated {
  readonly __typename: "RwDeckCreated";
  readonly created: DeckUpdates_rwDeckUpdates_RwDeckCreated_created | null;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_cards_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_cards_deck;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_owner;
  readonly cards: ReadonlyArray<DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated_cards>;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckUpdated {
  readonly __typename: "RwDeckUpdated";
  readonly updated: DeckUpdates_rwDeckUpdates_RwDeckUpdated_updated | null;
}

export interface DeckUpdates_rwDeckUpdates_RwDeckDeleted {
  readonly __typename: "RwDeckDeleted";
  readonly deletedId: string | null;
}

export type DeckUpdates_rwDeckUpdates = DeckUpdates_rwDeckUpdates_RwDeckCreated | DeckUpdates_rwDeckUpdates_RwDeckUpdated | DeckUpdates_rwDeckUpdates_RwDeckDeleted;

export interface DeckUpdates {
  readonly rwDeckUpdates: DeckUpdates_rwDeckUpdates;
}

export interface DeckUpdatesVariables {
  readonly id: string;
}
