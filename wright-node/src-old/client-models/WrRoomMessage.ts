import gql from 'graphql-tag';
import { WR_USER_STUB } from './WrUserStub';
import { WR_ROOM_STUB } from './WrRoomStub';
import { WR_ROOM_MESSAGE_STUB } from './WrRoomMessageStub';

// tslint:disable-next-line: variable-name
export const WR_ROOM_MESSAGE = gql`
${WR_ROOM_MESSAGE_STUB}
${WR_USER_STUB}
${WR_USER_STUB}
${WR_ROOM_STUB}
fragment WrRoomMessage on RwRoomMessage {
  ...WrRoomMessageStub
  sender {
    ...WrUserStub
  }
  room {
    ...WrRoomStub
  }
}
`;
