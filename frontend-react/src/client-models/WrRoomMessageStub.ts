import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WR_ROOM_MESSAGE_STUB = gql`
fragment WrRoomMessageStub on RwRoomMessage {
  id
  content
  contentType
}
`;
