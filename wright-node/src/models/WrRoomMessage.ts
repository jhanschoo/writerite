import gql from 'graphql-tag';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrRoomStub, IWrRoomStub } from './WrRoomStub';
import { WrRoomMessageStub, IWrRoomMessageStub } from './WrRoomMessageStub';

// tslint:disable-next-line: variable-name
export const WrRoomMessage = gql`
${WrRoomMessageStub}
${WrUserStub}
${WrUserStub}
${WrRoomStub}
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

export interface IWrRoomMessage extends IWrRoomMessageStub {
  sender?: IWrUserStub;
  room: IWrRoomStub;
}
