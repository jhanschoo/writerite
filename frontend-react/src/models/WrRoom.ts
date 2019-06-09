import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';
import { WrRoomStub, IWrRoomStub } from './WrRoomStub';
import { WrRoomMessageStub, IWrRoomMessageStub } from './WrRoomMessageStub';

export const WrRoom = gql`
${WrRoomStub}
${WrUserStub}
${WrDeckStub}
${WrRoomMessageStub}
fragment WrRoom on RwRoom {
  ...WrRoomStub
  owner {
    ...WrUserStub
  }
  occupants {
    ...WrUserStub
  }
  deck {
    ...WrDeckStub
  }
  messages {
    ...WrRoomMessageStub
  }
}
`;

export interface IWrRoom extends IWrRoomStub {
  owner: IWrUserStub;
  occupants: IWrUserStub[];
  deck: IWrDeckStub;
  messages: IWrRoomMessageStub[];
}
