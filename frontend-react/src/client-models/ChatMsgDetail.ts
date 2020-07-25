import gql from "graphql-tag";
import { USER_SCALARS } from "./UserScalars";
import { ROOM_SCALARS } from "./RoomScalars";
import { CHAT_MSG_SCALARS } from "./ChatMsgScalars";

export const CHAT_MSG_DETAIL = gql`
${CHAT_MSG_SCALARS}
${USER_SCALARS}
${USER_SCALARS}
${ROOM_SCALARS}
fragment ChatMsgDetail on ChatMsg {
  ...ChatMsgScalars
  sender {
    ...UserScalars
  }
  room {
    ...RoomScalars
  }
}
`;
