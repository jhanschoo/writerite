/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnDecks
// ====================================================

export interface OwnDecks_ownDecks_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface OwnDecks_ownDecks_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface OwnDecks_ownDecks_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface OwnDecks_ownDecks_cards {
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

export interface OwnDecks_ownDecks {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: OwnDecks_ownDecks_owner | null;
  readonly parents: ReadonlyArray<(OwnDecks_ownDecks_parents | null)> | null;
  readonly children: ReadonlyArray<(OwnDecks_ownDecks_children | null)> | null;
  readonly cards: ReadonlyArray<(OwnDecks_ownDecks_cards | null)> | null;
}

export interface OwnDecks {
  readonly ownDecks: ReadonlyArray<(OwnDecks_ownDecks | null)> | null;
}
