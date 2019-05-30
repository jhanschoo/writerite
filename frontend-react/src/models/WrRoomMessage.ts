import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrRoomStub, IWrRoomStub } from './WrRoomStub';
import { WrRoomMessageStub, IWrRoomMessageStub } from './WrRoomMessageStub';

export const WrRoomMessage = gql`
fragment WrRoomMessage on RwRoomMessage {
  ...WrRoomMessageStub
  sender {
    ...WrUserStub
  }
  room {
    ...WrRoomStub
  }
}
${WrRoomMessageStub}
${WrUserStub}
${WrUserStub}
${WrRoomStub}
`;

export interface IWrRoomMessage extends IWrRoomMessageStub {
  sender?: IWrUserStub;
  room: IWrRoomStub;
}
