import { gql } from 'graphql.macro';
import { WrDeck, WrDeckUpdatesPayload } from '../types';

// Decks query

export const OWN_DECKS_QUERY = gql`
query OwnDecks {
  rwOwnDecks {
    id
    name
  }
}
`;
export type OwnDecksVariables = object;

export interface OwnDecksData {
  readonly rwOwnDecks: WrDeck[] | null;
}

// OwnDecksUpdates subscription

export const OWN_DECKS_UPDATES_SUBSCRIPTION = gql`
subscription OwnDecksUpdates {
  rwOwnDecksUpdates {
    mutation
    new {
      id
      name
    }
    oldId
  }
}
`;

export type OwnDecksUpdatesVariables = object;

export interface OwnDecksUpdatesData {
  readonly rwOwnDecksUpdates: WrDeckUpdatesPayload;
}
