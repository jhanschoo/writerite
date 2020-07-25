import gql from "graphql-tag";

export const ROOM_SCALARS = gql`
fragment RoomScalars on Room {
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
