/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardCreateInput } from "./../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: CardCreate
// ====================================================

export interface CardCreate_cardCreate_ownRecord {
  readonly __typename: "UserCardRecord";
  readonly cardId: string;
  readonly userId: string;
  readonly correctRecord: ReadonlyArray<(GraphQLDateTime | null)>;
}

export interface CardCreate_cardCreate {
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
  readonly ownRecord: CardCreate_cardCreate_ownRecord | null;
}

export interface CardCreate {
  readonly cardCreate: CardCreate_cardCreate | null;
}

export interface CardCreateVariables {
  readonly deckId: string;
  readonly card: CardCreateInput;
  readonly mainTemplate: boolean;
}
