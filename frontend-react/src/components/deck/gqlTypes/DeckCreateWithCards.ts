/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardCreateInput } from "./../../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: DeckCreateWithCards
// ====================================================

export interface DeckCreateWithCards_deckCreate {
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

export interface DeckCreateWithCards {
  readonly deckCreate: DeckCreateWithCards_deckCreate | null;
}

export interface DeckCreateWithCardsVariables {
  readonly name?: string | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly cards: ReadonlyArray<CardCreateInput>;
}
