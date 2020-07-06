/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckCreateFromRows
// ====================================================

export interface DeckCreateFromRows_deckCreateFromRows_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckCreateFromRows_deckCreateFromRows_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckCreateFromRows_deckCreateFromRows_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckCreateFromRows_deckCreateFromRows_cards {
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

export interface DeckCreateFromRows_deckCreateFromRows {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: DeckCreateFromRows_deckCreateFromRows_owner | null;
  readonly parents: ReadonlyArray<(DeckCreateFromRows_deckCreateFromRows_parents | null)> | null;
  readonly children: ReadonlyArray<(DeckCreateFromRows_deckCreateFromRows_children | null)> | null;
  readonly cards: ReadonlyArray<(DeckCreateFromRows_deckCreateFromRows_cards | null)> | null;
}

export interface DeckCreateFromRows {
  readonly deckCreateFromRows: DeckCreateFromRows_deckCreateFromRows | null;
}

export interface DeckCreateFromRowsVariables {
  readonly name?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly rows: ReadonlyArray<ReadonlyArray<string>>;
}
