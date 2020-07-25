/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CardScalars
// ====================================================

export interface CardScalars {
  readonly __typename: "Card";
  readonly id: string;
  readonly deckId: string;
  readonly prompt: Json;
  readonly fullAnswer: Json;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: DateTime;
  readonly template: boolean;
}
