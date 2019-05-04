import { gql } from 'graphql.macro';
import { WrCard, CardUpdatesPayload } from './types';

// Cards query

export const CARDS_QUERY = gql`
query Cards($deckId: ID!) {
  rwCardsOfDeck(deckId: $deckId) {
    id
    front
    back
  }
}
`;

export interface CardsVariables {
  readonly deckId: string;
}

export interface CardsData {
  readonly rwCardsOfDeck: WrCard[] | null;
}

// CardCreate mutation

export const CARD_CREATE_MUTATION = gql`
mutation CardCreate(
  $front: String! $back: String! $deckId: ID!
) {
  rwCardCreate(
    deckId: $deckId front: $front back: $back
  ) {
    id
    front
    back
  }
}
`;

export interface CardCreateVariables {
  readonly deckId: string;
  readonly front: string;
  readonly back: string;
}

export interface CardCreateData {
  readonly rwCardSave: WrCard | null;
}

// CardEdit mutation

export const CARD_UPDATE_MUTATION = gql`
mutation CardUpdate(
  $id: ID! $front: String $back: String $sortKey: String
) {
  rwCardUpdate(
    id: $id front: $front back: $back sortKey: $sortKey
  ) {
    id
    front
    back
    sortKey
  }
}
`;

export interface CardUpdateVariables {
  readonly id: string;
  readonly front?: string;
  readonly back?: string;
  readonly sortKey?: string;
}

export interface CardUpdateData {
  readonly rwCardSave: WrCard | null;
}

// CardDelete mutation

export const CARD_DELETE_MUTATION = gql`
mutation CardDelete($id: ID!) {
  rwCardDelete(id: $id)
}
`;

export interface CardDeleteVariables {
  id: string;
}

export interface CardDeleteData {
  rwCardDelete: string | null;
}

// CardUpdates subscription

export const CARD_UPDATES_SUBSCRIPTION = gql`
subscription CardUpdates($deckId: ID!) {
  rwCardUpdatesOfDeck(deckId: $deckId) {
    mutation
    new {
      id
      front
      back
      sortKey
    }
    oldId
  }
}
`;

export interface CardUpdatesVariables {
  deckId: string;
}

export interface CardUpdatesData {
  rwCardUpdatesOfDeck: CardUpdatesPayload;
}
