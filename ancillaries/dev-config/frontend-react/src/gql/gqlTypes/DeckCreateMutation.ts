/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardCreateInput } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: DeckCreateMutation
// ====================================================

export interface DeckCreateMutation_deckCreate {
  readonly __typename: "Deck";
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly description: GraphQLJSON;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly published: boolean;
  readonly archived: boolean;
  readonly usedAt: GraphQLDateTime;
  readonly editedAt: GraphQLDateTime;
}

export interface DeckCreateMutation {
  readonly deckCreate: DeckCreateMutation_deckCreate | null;
}

export interface DeckCreateMutationVariables {
  readonly name?: string | null;
  readonly description?: GraphQLJSONObject | null;
  readonly promptLang?: string | null;
  readonly answerLang?: string | null;
  readonly published?: boolean | null;
  readonly archived?: boolean | null;
  readonly cards?: ReadonlyArray<CardCreateInput> | null;
}
