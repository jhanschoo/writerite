import gql from 'graphql-tag';
import { WrDeck, WrDeckUpdatesPayload } from './types';

// Deck query

export const DECK_QUERY = gql`
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
    id
    name
    owner {
      id
      email
    }
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

export const DECKS_QUERY = gql`
query Decks {
  rwDecks {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export type DecksVariables = object;

export interface DecksData {
  readonly rwDecks: WrDeck[] | null;
}

// DeckCreate mutation

export const DECK_CREATE_MUTATION = gql`
mutation DeckCreate($name: String) {
  rwDeckSave(name: $name) {
    id
    name
  }
}
`;

export interface DeckCreateVariables {
  readonly name?: string;
}

export interface DeckCreateData {
  readonly rwDeckSave: WrDeck | null;
}

// DeckUpdate mutation

export const DECK_UPDATE_MUTATION = gql`
mutation DeckUpdate($id: ID! $name: String!) {
  rwDeckSave(id: $id name: $name) {
    id
    name
  }
}
`;

export interface DeckUpdateVariables {
  readonly id: string;
  readonly name: string;
}

export interface DeckUpdateData {
  readonly rwDeckSave: WrDeck | null;
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

export const DECK_UPDATES_SUBSCRIPTION = gql`
subscription DeckUpdates {
  rwDeckUpdates {
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

export type DeckUpdatesVariables = object;

export interface DeckUpdatesData {
  readonly rwDeckUpdates: WrDeckUpdatesPayload;
}
