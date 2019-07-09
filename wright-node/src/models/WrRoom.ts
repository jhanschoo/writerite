import gql from 'graphql-tag';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrRoomStub, IWrRoomStub } from './WrRoomStub';
import { WrRoomMessageStub, IWrRoomMessageStub } from './WrRoomMessageStub';

// tslint:disable-next-line: variable-name
export const WrRoom = gql`
${WrRoomStub}
${WrUserStub}
${WrRoomMessageStub}
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

export interface IWrRoom extends IWrRoomStub {
  owner: IWrUserStub;
  occupants: IWrUserStub[];
  messages: IWrRoomMessageStub[];
}
