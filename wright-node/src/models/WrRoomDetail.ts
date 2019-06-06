import gql from 'graphql-tag';
import { WrDeck, IWrDeck } from './WrDeck';
import { WrRoom, IWrRoom } from './WrRoom';
import { WrRoomMessage, IWrRoomMessage } from './WrRoomMessage';

// tslint:disable-next-line: variable-name
export const WrRoomDetail = gql`
${WrRoom}
${WrDeck}
${WrRoomMessage}
fragment WrRoomDetail on RwRoom {
    ...WrRoom
    deck {
      ...WrDeck
    }
    messages {
      ...WrRoomMessage
    }
}
`;

export interface IWrRoomDetail extends IWrRoom {
  deck: IWrDeck;
  messages: IWrRoomMessage[];
}
