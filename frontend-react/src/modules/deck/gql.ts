import { gql } from 'graphql.macro';

import { WrDeck, WrDeckDetail, WrDeckUpdatesPayload } from './types';

// Deck query

export const DECK_QUERY = gql`
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
    id
    name
    nameLang
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
    nameLang
    promptLang
    answerLang
    cards {
      id
      prompt
      fullAnswer
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
mutation DeckCreate(
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
  ) {
  rwDeckCreate(
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
  ) {
    id
    name
    nameLang
    promptLang
    answerLang
  }
}
`;

export interface DeckCreateVariables {
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
}

export interface DeckCreateData {
  readonly rwDeckCreate: WrDeck | null;
}

// DeckEdit mutation

export const DECK_EDIT_MUTATION = gql`
mutation DeckEdit(
    $id: ID!
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
  ) {
  rwDeckEdit(
    id: $id
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
  ) {
    id
    name
    nameLang
    promptLang
    answerLang
  }
}
`;

export interface DeckEditVariables {
  readonly id: string;
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
}

export interface DeckEditData {
  readonly rwDeckEdit: WrDeck | null;
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
      nameLang
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
