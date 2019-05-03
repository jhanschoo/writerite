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
