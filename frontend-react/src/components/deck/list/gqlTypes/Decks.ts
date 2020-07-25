/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecksQueryScope } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: Decks
// ====================================================

export interface Decks_decks {
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

export interface Decks {
  readonly decks: ReadonlyArray<(Decks_decks | null)> | null;
}

export interface DecksVariables {
  readonly cursor?: string | null;
  readonly take?: number | null;
  readonly titleFilter?: string | null;
  readonly scope?: DecksQueryScope | null;
}
