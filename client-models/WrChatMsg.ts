import gql from 'graphql-tag';
import { WR_USER_SCALARS } from './WrUserScalars';
import { WR_ROOM_SCALARS } from './WrRoomScalars';
import { WR_CHAT_MSG_SCALARS } from './WrChatMsgScalars';

export const WR_CHAT_MSG = gql`
${WR_CHAT_MSG_SCALARS}
${WR_USER_SCALARS}
${WR_USER_SCALARS}
${WR_ROOM_SCALARS}
fragment WrChatMsg on ChatMsg {
  ...WrChatMsgScalars
  sender {
    ...WrUserScalars
  }
  room {
    ...WrRoomScalars
  }
}
`;
