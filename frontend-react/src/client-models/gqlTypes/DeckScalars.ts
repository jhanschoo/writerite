/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DeckScalars
// ====================================================

export interface DeckScalars {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: GraphQLJSON;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: GraphQLDateTime;
  readonly editedAt: GraphQLDateTime;
}
