/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckDetail
// ====================================================

export interface DeckDetail_rwDeck_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckDetail_rwDeck_cards_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface DeckDetail_rwDeck_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: DeckDetail_rwDeck_cards_deck;
}

export interface DeckDetail_rwDeck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: DeckDetail_rwDeck_owner;
  readonly cards: ReadonlyArray<DeckDetail_rwDeck_cards>;
}

export interface DeckDetail {
  readonly rwDeck: DeckDetail_rwDeck | null;
}

export interface DeckDetailVariables {
  readonly id: string;
}
