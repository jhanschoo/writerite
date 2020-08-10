import gql from "graphql-tag";
import { USER_SCALARS } from "./UserScalars";
import { ROOM_SCALARS } from "./RoomScalars";
import { CHAT_MSG_SCALARS } from "./ChatMsgScalars";

export const ROOM_DETAIL = gql`
${ROOM_SCALARS}
${USER_SCALARS}
${CHAT_MSG_SCALARS}
fragment RoomDetail on Room {
  ...RoomScalars
  owner {
    ...UserScalars
  }
  occupants {
    ...UserScalars
  }
  chatMsgs {
    ...ChatMsgScalars
  }
}
`;
