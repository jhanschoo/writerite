import gql from "graphql-tag";
import { CARD_DETAIL, DECK_DETAIL, DECK_SCALARS, ROOM_SCALARS, USER_DECK_RECORD_SCALARS } from "src/client-models";

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
query DeckDetailQuery($deckId: ID!) {
  deck(id: $deckId) {
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

export const OWN_DECK_RECORD_QUERY = gql`
${USER_DECK_RECORD_SCALARS}
query OwnDeckRecordQuery($deckId: ID!) {
  ownDeckRecord(deckId: $deckId) {
    ...UserDeckRecordScalars
  }
}
`;
