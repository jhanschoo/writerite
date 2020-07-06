/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WrDeck
// ====================================================

export interface WrDeck_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrDeck_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface WrDeck_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface WrDeck_cards {
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

export interface WrDeck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: WrDeck_owner | null;
  readonly parents: ReadonlyArray<(WrDeck_parents | null)> | null;
  readonly children: ReadonlyArray<(WrDeck_children | null)> | null;
  readonly cards: ReadonlyArray<(WrDeck_cards | null)> | null;
}
