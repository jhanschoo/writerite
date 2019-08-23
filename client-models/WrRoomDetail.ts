import { gql } from 'graphql.macro';
import { WR_ROOM } from './WrRoom';
import { WR_ROOM_MESSAGE } from './WrRoomMessage';

// tslint:disable-next-line: variable-name
export const WR_ROOM_DETAIL = gql`
${WR_ROOM}
${WR_ROOM_MESSAGE}
fragment WrRoomDetail on RwRoom {
    ...WrRoom
    messages {
      ...WrRoomMessage
    }
}
`;
