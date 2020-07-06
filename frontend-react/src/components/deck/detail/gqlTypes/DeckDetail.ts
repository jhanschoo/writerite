/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckDetail
// ====================================================

export interface DeckDetail_deck_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckDetail_deck_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckDetail_deck_children_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckDetail_deck_children_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckDetail_deck_children_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckDetail_deck_children_cards {
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

export interface DeckDetail_deck_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: DeckDetail_deck_children_owner | null;
  readonly parents: ReadonlyArray<(DeckDetail_deck_children_parents | null)> | null;
  readonly children: ReadonlyArray<(DeckDetail_deck_children_children | null)> | null;
  readonly cards: ReadonlyArray<(DeckDetail_deck_children_cards | null)> | null;
}

export interface DeckDetail_deck_cards_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckDetail_deck_cards {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: any;
  readonly template: boolean;
  readonly deck: DeckDetail_deck_cards_deck | null;
}

export interface DeckDetail_deck {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: DeckDetail_deck_owner | null;
  readonly parents: ReadonlyArray<(DeckDetail_deck_parents | null)> | null;
  readonly children: ReadonlyArray<(DeckDetail_deck_children | null)> | null;
  readonly cards: ReadonlyArray<(DeckDetail_deck_cards | null)> | null;
}

export interface DeckDetail {
  readonly deck: DeckDetail_deck | null;
}

export interface DeckDetailVariables {
  readonly deckId: string;
}
