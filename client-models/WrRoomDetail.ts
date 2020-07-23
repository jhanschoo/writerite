import gql from "graphql-tag";
import { WR_ROOM } from "./WrRoom";
import { WR_CHAT_MSG } from "./WrChatMsg";

// tslint:disable-next-line: variable-name
export const WR_ROOM_DETAIL = gql`
${WR_ROOM}
${WR_CHAT_MSG}
fragment WrRoomDetail on Room {
    ...WrRoom
    chatMsgs {
      ...WrChatMsg
    }
}
`;
