import gql from "graphql-tag";
import { CHAT_MSG_DETAIL } from "src/client-models";

export const CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION = gql`
${CHAT_MSG_DETAIL}
subscription ChatMsgsOfRoomUpdates($roomId: ID!) {
  chatMsgsOfRoomUpdates(roomId: $roomId) {
    type
    data {
      ...ChatMsgDetail
    }
  }
}
`;
