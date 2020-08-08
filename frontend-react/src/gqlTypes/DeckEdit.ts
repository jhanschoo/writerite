/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckEdit
// ====================================================

export interface DeckEdit_deckEdit {
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

export interface DeckEdit {
  readonly deckEdit: DeckEdit_deckEdit | null;
}

export interface DeckEditVariables {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: GraphQLJSONObject | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly published?: boolean | null;
}
