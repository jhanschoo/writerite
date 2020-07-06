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
}

export interface CardDelete {
  readonly cardDelete: CardDelete_cardDelete | null;
}

export interface CardDeleteVariables {
  readonly id: string;
}
