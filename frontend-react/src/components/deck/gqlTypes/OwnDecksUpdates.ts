/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateType } from "./../../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: OwnDecksUpdates
// ====================================================

export interface OwnDecksUpdates_ownDecksUpdates_data_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecksUpdates_ownDecksUpdates_data_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface OwnDecksUpdates_ownDecksUpdates_data_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface OwnDecksUpdates_ownDecksUpdates_data_cards {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: any;
  readonly template: boolean;
}

export interface OwnDecksUpdates_ownDecksUpdates_data {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: OwnDecksUpdates_ownDecksUpdates_data_owner | null;
  readonly parents: ReadonlyArray<(OwnDecksUpdates_ownDecksUpdates_data_parents | null)> | null;
  readonly children: ReadonlyArray<(OwnDecksUpdates_ownDecksUpdates_data_children | null)> | null;
  readonly cards: ReadonlyArray<(OwnDecksUpdates_ownDecksUpdates_data_cards | null)> | null;
}

export interface OwnDecksUpdates_ownDecksUpdates {
  readonly __typename: "DeckUpdate";
  readonly type: UpdateType;
  readonly data: OwnDecksUpdates_ownDecksUpdates_data | null;
}

export interface OwnDecksUpdates {
  readonly ownDecksUpdates: OwnDecksUpdates_ownDecksUpdates | null;
}
