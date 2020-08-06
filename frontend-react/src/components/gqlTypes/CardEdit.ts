/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CardEdit
// ====================================================

export interface CardEdit_cardEdit_ownRecord {
  readonly __typename: "UserCardRecord";
  readonly cardId: string;
  readonly userId: string;
  readonly correctRecord: ReadonlyArray<(GraphQLDateTime | null)>;
}

export interface CardEdit_cardEdit {
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
  readonly ownRecord: CardEdit_cardEdit_ownRecord | null;
}

export interface CardEdit {
  readonly cardEdit: CardEdit_cardEdit | null;
}

export interface CardEditVariables {
  readonly id: string;
  readonly prompt?: GraphQLJSONObject | null;
  readonly fullAnswer?: GraphQLJSONObject | null;
  readonly answers?: ReadonlyArray<string> | null;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
  readonly mainTemplate?: boolean | null;
}
