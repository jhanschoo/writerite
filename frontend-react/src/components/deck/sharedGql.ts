import gql from 'graphql-tag';
import { WR_DECK, WR_ROOM } from '../../client-models';

export const OWN_DECKS_QUERY = gql`
${WR_DECK}
query OwnDecks {
  rwOwnDecks {
    ...WrDeck
  }
}
`;

export const OWN_DECKS_UPDATES_SUBSCRIPTION = gql`
${WR_DECK}
subscription OwnDecksUpdates {
  rwOwnDecksUpdates {
    ... on RwDeckCreated {
      created {
        ...WrDeck
      }
    }
    ... on RwDeckUpdated {
      updated {
        ...WrDeck
      }
    }
    ... on RwDeckDeleted {
      deletedId
    }
  }
}
`;

export const ROOM_CREATE_MUTATION = gql`
${WR_ROOM}
mutation RoomCreate(
  $config: IRoomConfigInput!
) {
  rwRoomCreate(
    config: $config
  ) {
    ...WrRoom
  }
}
`;
