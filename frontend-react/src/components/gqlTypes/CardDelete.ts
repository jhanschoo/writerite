/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardDelete
// ====================================================

export interface CardDelete_cardDelete {
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

export interface CardDelete {
  readonly cardDelete: CardDelete_cardDelete | null;
}

export interface CardDeleteVariables {
  readonly id: string;
}
