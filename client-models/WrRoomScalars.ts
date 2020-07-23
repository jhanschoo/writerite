import gql from "graphql-tag";

// tslint:disable-next-line: variable-name
export const WR_ROOM_SCALARS = gql`
fragment WrRoomScalars on Room {
  id
  ownerId
  archived
  inactive
  config {
    deckId
    deckName
    roundLength
    clientDone
  }
}
`;
