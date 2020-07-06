import gql from 'graphql-tag';
import { WR_DECK, WR_ROOM } from '../../client-models';

export const OWN_DECKS_QUERY = gql`
${WR_DECK}
query OwnDecks {
  ownDecks {
    ...WrDeck
  }
}
`;

export const OWN_DECKS_UPDATES_SUBSCRIPTION = gql`
${WR_DECK}
subscription OwnDecksUpdates {
  ownDecksUpdates {
    type
    data {
      ...WrDeck
    }
  }
}
`;

export const ROOM_CREATE_MUTATION = gql`
${WR_ROOM}
mutation RoomCreate(
  $config: RoomConfigInput!
) {
  roomCreate(
    config: $config
  ) {
    ...WrRoom
  }
}
`;
