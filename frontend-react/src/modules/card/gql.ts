import { gql } from 'graphql.macro';
import { WrCard, CardUpdatesPayload } from './types';

// Cards query

export const CARDS_QUERY = gql`
query Cards($deckId: ID!) {
  rwCardsOfDeck(deckId: $deckId) {
    id
    prompt
    fullAnswer
    sortKey
    editedAt
    template
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
  $prompt: String! $fullAnswer: String! $deckId: ID! $sortKey: String $template: Boolean
) {
  rwCardCreate(
    deckId: $deckId
    prompt: $prompt
    fullAnswer: $fullAnswer
    sortKey: $sortKey
    template: $template
  ) {
    id
    prompt
    fullAnswer
    sortKey
    editedAt
    template
  }
}
`;

export interface CardCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
}

export interface CardCreateData {
  readonly rwCardSave: WrCard | null;
}

// CardEdit mutation

export const CARD_EDIT_MUTATION = gql`
mutation CardEdit(
  $id: ID! $prompt: String $fullAnswer: String $sortKey: String $template: Boolean
) {
  rwCardEdit(
    id: $id
    prompt: $prompt
    fullAnswer: $fullAnswer
    sortKey: $sortKey
    template: $template
  ) {
    id
    prompt
    fullAnswer
    sortKey
    editedAt
    template
  }
}
`;

export interface CardEditVariables {
  readonly id: string;
  readonly prompt?: string;
  readonly fullAnswer?: string;
  readonly sortKey?: string;
  readonly template?: boolean;
}

export interface CardEditData {
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

// CardsUpdates subscription

export const CARDS_UPDATES_SUBSCRIPTION = gql`
subscription CardsUpdates($deckId: ID!) {
  rwCardsUpdatesOfDeck(deckId: $deckId) {
    mutation
    new {
      id
      prompt
      fullAnswer
      sortKey
      editedAt
      template
    }
    oldId
  }
}
`;

export interface CardsUpdatesVariables {
  deckId: string;
}

export interface CardsUpdatesData {
  rwCardsUpdatesOfDeck: CardUpdatesPayload;
}
