import gql from "graphql-tag";
import { CHAT_MSG_SCALARS, ROOM_SCALARS } from "../client-models";

export const ROOMS_UPDATES_SUBSCRIPTION = gql`
  ${ROOM_SCALARS}
  subscription RoomsUpdatesSubscription {
    roomsUpdates {
      type
      data {
        ...RoomScalars
      }
    }
  }
`;

export const CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION = gql`
  ${CHAT_MSG_SCALARS}
  subscription ChatMsgsOfRoomUpdatesSubscription($roomId: ID!) {
    chatMsgsOfRoomUpdates(roomId: $roomId) {
      type
      data {
        ...ChatMsgScalars
      }
    }
  }
`;
