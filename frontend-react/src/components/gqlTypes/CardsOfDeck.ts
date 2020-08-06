/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CardsOfDeck
// ====================================================

export interface CardsOfDeck_cardsOfDeck_ownRecord {
  readonly __typename: "UserCardRecord";
  readonly cardId: string;
  readonly userId: string;
  readonly correctRecord: ReadonlyArray<(GraphQLDateTime | null)>;
}

export interface CardsOfDeck_cardsOfDeck {
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
  readonly ownRecord: CardsOfDeck_cardsOfDeck_ownRecord | null;
}

export interface CardsOfDeck {
  readonly cardsOfDeck: ReadonlyArray<(CardsOfDeck_cardsOfDeck | null)> | null;
}

export interface CardsOfDeckVariables {
  readonly deckId: string;
}
