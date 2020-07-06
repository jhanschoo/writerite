import gql from 'graphql-tag';
import { WR_USER_SCALARS } from './WrUserScalars';
import { WR_ROOM_SCALARS } from './WrRoomScalars';
import { WR_CHAT_MSG_SCALARS } from './WrChatMsgScalars';

// tslint:disable-next-line: variable-name
export const WR_ROOM = gql`
${WR_ROOM_SCALARS}
${WR_USER_SCALARS}
${WR_CHAT_MSG_SCALARS}
fragment WrRoom on Room {
  ...WrRoomScalars
  owner {
    ...WrUserScalars
  }
  occupants {
    ...WrUserScalars
  }
  chatMsgs {
    ...WrChatMsgScalars
  }
}
`;
