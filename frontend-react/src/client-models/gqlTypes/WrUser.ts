/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WrUser
// ====================================================

export interface WrUser_decks {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface WrUser {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
  readonly decks: ReadonlyArray<WrUser_decks>;
}
