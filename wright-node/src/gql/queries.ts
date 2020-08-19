import gql from "graphql-tag";
import { CARD_SCALARS, CHAT_MSG_SCALARS, ROOM_DETAIL, USER_SCALARS } from "../client-models";

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

export const CHAT_MSG_CREATE_MUTATION = gql`
${CHAT_MSG_SCALARS}
mutation ChatMsgCreateMutation(
  $roomId: ID!
  $type: ChatMsgContentType!
  $content: JSON!
) {
  chatMsgCreate(content: $content, roomId: $roomId, type: $type) {
    ...ChatMsgScalars
  }
}
`;
