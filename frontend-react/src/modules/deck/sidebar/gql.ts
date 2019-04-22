import gql from 'graphql-tag';

import { WrDeck, WrDeckUpdatesPayload } from './types';

// Deck query

export const DECK_QUERY = gql`
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
    id
    name
  }
}
`;

export interface DeckVariables {
  readonly deckId: string;
}

export interface DeckData {
  readonly rwDeck: WrDeck | null;
}

// Decks query

export const OWN_DECKS_QUERY = gql`
query OwnDecks {
  rwOwnDecks {
    id
    name
  }
}
`;

export type DecksVariables = object;

export interface OwnDecksData {
  readonly rwOwnDecks: WrDeck[] | null;
}

// DeckCreate mutation

export const DECK_CREATE_MUTATION = gql`
mutation DeckCreate($name: String) {
  rwDeckCreate(name: $name) {
    id
    name
  }
}
`;

export interface DeckCreateVariables {
  readonly name?: string;
}

export interface DeckCreateData {
  readonly rwDeckCreate: WrDeck | null;
}

// DeckUpdate mutation

export const DECK_UPDATE_NAME_MUTATION = gql`
mutation DeckUpdate($id: ID! $name: String!) {
  rwDeckUpdateName(id: $id name: $name) {
    id
    name
  }
}
`;

export interface DeckUpdateNameVariables {
  readonly id: string;
  readonly name: string;
}

export interface DeckUpdateData {
  readonly rwDeckUpdateName: WrDeck | null;
}

// DeckDelete mutation

export const DECK_DELETE_MUTATION = gql`
mutation DeckDelete($id: ID!) {
  rwDeckDelete(id: $id)
}
`;

export interface DeckDeleteVariables {
  readonly id: string;
}

export interface DeckDeleteData {
  readonly rwDeckDelete: string | null;
}

// DeckUpdates subscription

export const OWN_DECK_UPDATES_SUBSCRIPTION = gql`
subscription DeckUpdates {
  rwOwnDeckUpdates {
    mutation
    new {
      id
      name
      owner {
        id
        email
      }
    }
    oldId
  }
}
`;

export type OwnDeckUpdatesVariables = object;

export interface OwnDeckUpdatesData {
  readonly rwOwnDeckUpdates: WrDeckUpdatesPayload;
}
