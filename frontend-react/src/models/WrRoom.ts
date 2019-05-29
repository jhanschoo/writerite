import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUser';
import { WrDeckStub, IWrDeckStub } from './WrDeck';
import { WrRoomMessageStub, IWrRoomMessageStub } from './WrRoomMessage';

export const WrRoomStub = gql`
fragment WrRoomStub on RwRoom {
  id
}
`;

export interface IWrRoomStub {
  id: string;
}

export const WrRoom = gql`
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
${WrRoomStub}
${WrUserStub}
${WrDeckStub}
${WrRoomMessageStub}
`;

export interface IWrRoom extends IWrRoomStub {
  owner: IWrUserStub;
  occupants: IWrUserStub[];
  deck: IWrDeckStub;
  messages: IWrRoomMessageStub[];
}
