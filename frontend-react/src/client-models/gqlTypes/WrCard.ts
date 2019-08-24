/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WrCard
// ====================================================

export interface WrCard_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface WrCard {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: WrCard_deck;
}
