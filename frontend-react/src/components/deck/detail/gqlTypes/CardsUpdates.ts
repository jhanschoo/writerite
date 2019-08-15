/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwMutationType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL subscription operation: CardsUpdates
// ====================================================

export interface CardsUpdates_rwCardsUpdatesOfDeck_new_deck {
  readonly __typename: "RwDeck";
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck_new {
  readonly __typename: "RwCard";
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
  readonly deck: CardsUpdates_rwCardsUpdatesOfDeck_new_deck;
}

export interface CardsUpdates_rwCardsUpdatesOfDeck {
  readonly __typename: "RwCardUpdate";
  readonly mutation: RwMutationType;
  readonly new: CardsUpdates_rwCardsUpdatesOfDeck_new | null;
  readonly oldId: string | null;
}

export interface CardsUpdates {
  readonly rwCardsUpdatesOfDeck: CardsUpdates_rwCardsUpdatesOfDeck;
}

export interface CardsUpdatesVariables {
  readonly deckId: string;
}
