import gql from "graphql-tag";
import { ROOM_SCALARS } from "../../client-models";

export const ROOM_CREATE_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomCreate(
  $config: RoomConfigInput!
) {
  roomCreate(
    config: $config
  ) {
    ...RoomScalars
  }
}
`;
