/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecksQueryScope } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: DecksQuery
// ====================================================

export interface DecksQuery_decks {
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

export interface DecksQuery {
  readonly decks: ReadonlyArray<(DecksQuery_decks | null)> | null;
}

export interface DecksQueryVariables {
  readonly cursor?: string | null;
  readonly take?: number | null;
  readonly titleFilter?: string | null;
  readonly scope?: DecksQueryScope | null;
}
