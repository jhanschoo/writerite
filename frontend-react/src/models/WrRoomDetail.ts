import { gql } from 'graphql.macro';
import { WrDeck, IWrDeck } from './WrDeck';
import { WrRoom, IWrRoom } from './WrRoom';
import { WrRoomMessage, IWrRoomMessage } from './WrRoomMessage';

export const WrRoomDetail = gql`
fragment WrRoomDetail on RwRoom {
    ...WrRoom
    deck {
      ...WrDeck
    }
    messages {
      ...WrRoomMessage
    }
}
${WrRoom}
${WrDeck}
${WrRoomMessage}
`;

export interface IWrRoomDetail extends IWrRoom {
  deck: IWrDeck;
  messages: IWrRoomMessage[];
}
