import gql from "graphql-tag";
import { ROOM_DETAIL, USER_SCALARS, CARD_SCALARS } from "../client-models";

export const USER_QUERY = gql`
${USER_SCALARS}
query UserQuery($id: ID!) {
  user(id: $id) {
    ...UserScalars
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

export const CARDS_UNDER_DECK_QUERY = gql`
${CARD_SCALARS}
query CardsUnderDeckQuery($deckId: ID!) {
  cardsUnderDeck(deckId: $deckId) {
    ...CardScalars
  }
}
`;
