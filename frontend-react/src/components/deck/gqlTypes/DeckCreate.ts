/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeckCreate
// ====================================================

export interface DeckCreate_deckCreate {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: Json;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly usedAt: DateTime;
  readonly editedAt: DateTime;
}

export interface DeckCreate {
  readonly deckCreate: DeckCreate_deckCreate | null;
}

export interface DeckCreateVariables {
  readonly name?: string | null;
  readonly description?: JsonObject | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly published?: boolean | null;
}
