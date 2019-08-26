/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SidebarOwnDecks
// ====================================================

export interface SidebarOwnDecks_rwOwnDecks_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface SidebarOwnDecks_rwOwnDecks_cards {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}

export interface SidebarOwnDecks_rwOwnDecks {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly owner: SidebarOwnDecks_rwOwnDecks_owner;
  readonly cards: ReadonlyArray<SidebarOwnDecks_rwOwnDecks_cards>;
}

export interface SidebarOwnDecks {
  readonly rwOwnDecks: ReadonlyArray<SidebarOwnDecks_rwOwnDecks> | null;
}
