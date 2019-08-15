/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwMutationType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL subscription operation: OwnDecksUpdates
// ====================================================

export interface OwnDecksUpdates_rwOwnDecksUpdates_new_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_new_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates_new {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: OwnDecksUpdates_rwOwnDecksUpdates_new_owner;
  readonly cards: ReadonlyArray<OwnDecksUpdates_rwOwnDecksUpdates_new_cards>;
}

export interface OwnDecksUpdates_rwOwnDecksUpdates {
  readonly __typename: "RwDeckUpdate";
  readonly mutation: RwMutationType;
  readonly new: OwnDecksUpdates_rwOwnDecksUpdates_new | null;
  readonly oldId: string | null;
}

export interface OwnDecksUpdates {
  readonly rwOwnDecksUpdates: OwnDecksUpdates_rwOwnDecksUpdates;
}
