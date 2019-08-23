/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: CardsUpdates
// ====================================================

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated_created_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated_created {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated_created_deck;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated {
  readonly __typename: "RwCardCreated";
  readonly created: CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated_created | null;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated_updated_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated_updated {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated_updated_deck;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated {
  readonly __typename: "RwCardUpdated";
  readonly updated: CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated_updated | null;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_RwCardDeleted {
  readonly __typename: "RwCardDeleted";
  readonly deletedId: string | null;
}

export type CardsUpdates_rwCardsUpdatesOfDeck = CardsUpdates_rwCardsUpdatesOfDeck_RwCardCreated | CardsUpdates_rwCardsUpdatesOfDeck_RwCardUpdated | CardsUpdates_rwCardsUpdatesOfDeck_RwCardDeleted;

export interface CardsUpdates {
  readonly rwCardsUpdatesOfDeck: CardsUpdates_rwCardsUpdatesOfDeck;
}

export interface CardsUpdatesVariables {
  readonly deckId: string;
}
