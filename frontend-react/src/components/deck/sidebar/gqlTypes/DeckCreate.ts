/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckCreate
// ====================================================

export interface DeckCreate_deckCreate_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface DeckCreate_deckCreate_parents {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckCreate_deckCreate_children {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
}

export interface DeckCreate_deckCreate_cards {
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

export interface DeckCreate_deckCreate {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly owner: DeckCreate_deckCreate_owner | null;
  readonly parents: ReadonlyArray<(DeckCreate_deckCreate_parents | null)> | null;
  readonly children: ReadonlyArray<(DeckCreate_deckCreate_children | null)> | null;
  readonly cards: ReadonlyArray<(DeckCreate_deckCreate_cards | null)> | null;
}

export interface DeckCreate {
  readonly deckCreate: DeckCreate_deckCreate | null;
}

export interface DeckCreateVariables {
  readonly name?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
}
