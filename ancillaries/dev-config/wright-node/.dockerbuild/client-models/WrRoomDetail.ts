import gql from 'graphql-tag';
import { WrRoom, IWrRoom } from './WrRoom';
import { WrRoomMessage, IWrRoomMessage } from './WrRoomMessage';

// tslint:disable-next-line: variable-name
export const WrRoomDetail = gql`
${WrRoom}
${WrRoomMessage}
fragment WrRoomDetail on RwRoom {
    ...WrRoom
    messages {
      ...WrRoomMessage
    }
}
`;

export interface IWrRoomDetail extends IWrRoom {
  readonly messages: IWrRoomMessage[];
}
