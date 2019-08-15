/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwMutationType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL subscription operation: DeckUpdates
// ====================================================

export interface DeckUpdates_rwDeckUpdates_new_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckUpdates_rwDeckUpdates_new_cards_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckUpdates_rwDeckUpdates_new_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: DeckUpdates_rwDeckUpdates_new_cards_deck;
}

export interface DeckUpdates_rwDeckUpdates_new {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckUpdates_rwDeckUpdates_new_owner;
  readonly cards: ReadonlyArray<DeckUpdates_rwDeckUpdates_new_cards>;
}

export interface DeckUpdates_rwDeckUpdates {
  readonly __typename: "RwDeckUpdate";
  readonly mutation: RwMutationType;
  readonly new: DeckUpdates_rwDeckUpdates_new | null;
  readonly oldId: string | null;
}

export interface DeckUpdates {
  readonly rwDeckUpdates: DeckUpdates_rwDeckUpdates;
}

export interface DeckUpdatesVariables {
  readonly id: string;
}
