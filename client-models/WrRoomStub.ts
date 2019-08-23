import { gql } from 'graphql.macro';

// tslint:disable-next-line: variable-name
export const WR_ROOM_STUB = gql`
fragment WrRoomStub on RwRoom {
  id
  config {
    deckId
    deckName
    deckNameLang
    roundLength
    clientDone
  }
}
`;
