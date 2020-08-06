/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CardDetail
// ====================================================

export interface CardDetail_ownRecord {
  readonly __typename: "UserCardRecord";
  readonly cardId: string;
  readonly userId: string;
  readonly correctRecord: ReadonlyArray<(GraphQLDateTime | null)>;
}

export interface CardDetail {
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
  readonly ownRecord: CardDetail_ownRecord | null;
}
