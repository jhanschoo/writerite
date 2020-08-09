/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardDeleteMutation
// ====================================================

export interface CardDeleteMutation_cardDelete {
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

export interface CardDeleteMutation {
  readonly cardDelete: CardDeleteMutation_cardDelete | null;
}

export interface CardDeleteMutationVariables {
  readonly id: string;
}
