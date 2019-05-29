import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUser';
import { WrRoomStub, IWrRoomStub } from './WrRoom';

export const WrRoomMessageStub = gql`
fragment WrRoomMessageStub on RwRoomMessage {
  id
  content
  contentType
}
`;

export enum WrMessageContentType {
  TEXT = 'TEXT',
}

export interface IWrRoomMessageStub {
  id: string;
  content: string;
  contentType: WrMessageContentType;
}

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
