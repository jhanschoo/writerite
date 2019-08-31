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
