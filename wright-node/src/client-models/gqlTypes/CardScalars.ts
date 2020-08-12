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
  readonly prompt: GraphQLJSON;
  readonly fullAnswer: GraphQLJSON;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly editedAt: GraphQLDateTime;
  readonly template: boolean;
  readonly mainTemplate: boolean;
}
