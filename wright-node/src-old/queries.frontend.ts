import gql from "graphql-tag";
import { CARD_DETAIL, CHAT_MSG_DETAIL, DECK_DETAIL, DECK_SCALARS, ROOM_DETAIL, ROOM_SCALARS, USER_DECK_RECORD_SCALARS } from "src/client-models";

export const DECK_QUERY = gql`
${DECK_SCALARS}
query DeckQuery(
  $id: ID!
) {
  deck(id: $id) {
    ...DeckScalars
  }
}
`;

export const DECKS_QUERY = gql`
${DECK_SCALARS}
query DecksQuery(
  $cursor: ID
  $take: Int
  $titleFilter: String
  $scope: DecksQueryScope
) {
  decks(
    cursor: $cursor
    take: $take
    titleFilter: $titleFilter
    scope: $scope
  ) {
    ...DeckScalars
  }
}
`;

export const DECK_DETAIL_QUERY = gql`
${DECK_DETAIL}
query DeckDetailQuery($id: ID!) {
  deck(id: $id) {
    ...DeckDetail
  }
}
`;

export const CARDS_OF_DECK_QUERY = gql`
${CARD_DETAIL}
query CardsOfDeckQuery($deckId: ID!) {
  cardsOfDeck(deckId: $deckId) {
    ...CardDetail
  }
}
`;

export const ROOM_QUERY = gql`
${ROOM_SCALARS}
query RoomQuery($id: ID!) {
  room(id: $id) {
    ...RoomScalars
  }
}
`;

export const ROOM_DETAIL_QUERY = gql`
${ROOM_DETAIL}
query RoomDetailQuery($id: ID!) {
  room(id: $id) {
    ...RoomDetail
  }
}
`;

export const CHAT_MSGS_OF_ROOM_QUERY = gql`
${CHAT_MSG_DETAIL}
query ChatMsgsOfRoomQuery($roomId: ID!) {
  chatMsgsOfRoom(roomId: $roomId) {
    ...ChatMsgDetail
  }
}
`;

export const OWN_DECK_RECORD_QUERY = gql`
${USER_DECK_RECORD_SCALARS}
query OwnDeckRecordQuery($deckId: ID!) {
  ownDeckRecord(deckId: $deckId) {
    ...UserDeckRecordScalars
  }
}
`;
