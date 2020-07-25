/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DeckDetail
// ====================================================

export interface DeckDetail_subdecks {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: Json;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: DateTime;
  readonly editedAt: DateTime;
}

export interface DeckDetail_ownRecord {
  readonly __typename: "UserDeckRecord";
  readonly deckId: string;
  readonly userId: string;
  readonly notes: Json;
}

export interface DeckDetail {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: Json;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: DateTime;
  readonly editedAt: DateTime;
  readonly subdecks: ReadonlyArray<(DeckDetail_subdecks | null)> | null;
  readonly ownRecord: DeckDetail_ownRecord | null;
}
