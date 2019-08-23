import { gql } from 'graphql.macro';
import { WR_USER_STUB } from './WrUserStub';
import { WR_ROOM_STUB } from './WrRoomStub';
import { WR_ROOM_MESSAGE_STUB } from './WrRoomMessageStub';

// tslint:disable-next-line: variable-name
export const WR_ROOM = gql`
${WR_ROOM_STUB}
${WR_USER_STUB}
${WR_ROOM_MESSAGE_STUB}
fragment WrRoom on RwRoom {
  ...WrRoomStub
  owner {
    ...WrUserStub
  }
  occupants {
    ...WrUserStub
  }
  messages {
    ...WrRoomMessageStub
  }
}
`;
