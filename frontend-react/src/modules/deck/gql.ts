import { gql } from 'graphql.macro';

import { WrDeck, WrDeckDetail, WrDeckUpdatesPayload } from './types';

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

// DeckDetail query

export const DECK_DETAIL_QUERY = gql`
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
    id
    name
    cards {
      id
      prompt
      fullAnswer
      promptLang
      answerLang
      sortKey
      editedAt
      template
    }
  }
}
`;

export interface DeckDetailVariables {
  readonly deckId: string;
}

export interface DeckDetailData {
  readonly rwDeck: WrDeckDetail | null;
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

// DeckEdit mutation

export const DECK_EDIT_NAME_MUTATION = gql`
mutation DeckEditName($id: ID! $name: String!) {
  rwDeckEditName(id: $id name: $name) {
    id
    name
  }
}
`;

export interface DeckEditNameVariables {
  readonly id: string;
  readonly name: string;
}

export interface DeckEditNameData {
  readonly rwDeckEditName: WrDeck | null;
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
subscription DeckUpdates($id: ID!) {
  rwDeckUpdates(id: $id) {
    mutation
    new {
      id
      name
    }
    oldId
  }
}
`;

export interface DeckUpdatesVariables {
  readonly id: string;
}

export interface DeckUpdatesData {
  readonly rwDeckUpdates: WrDeckUpdatesPayload;
}
