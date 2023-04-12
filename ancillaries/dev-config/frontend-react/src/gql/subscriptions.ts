import gql from "graphql-tag";
import { CHAT_MSG_DETAIL, ROOM_DETAIL } from "src/client-models";

export const CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION = gql`
  ${CHAT_MSG_DETAIL}
  subscription ChatMsgsOfRoomUpdatesSubscription($roomId: ID!) {
    chatMsgsOfRoomUpdates(roomId: $roomId) {
      type
      data {
        ...ChatMsgDetail
      }
    }
  }
`;

export const ROOM_UPDATES_SUBSCRIPTION = gql`
  ${ROOM_DETAIL}
  subscription RoomUpdatesSubscription($id: ID!) {
    roomUpdates(id: $id) {
      type
      data {
        ...RoomDetail
      }
    }
  }
`;
