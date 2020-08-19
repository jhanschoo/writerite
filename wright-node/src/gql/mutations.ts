import gql from "graphql-tag";
import { ROOM_SCALARS } from "../client-models";

export const ROOM_SET_STATE_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomSetStateMutation($id: ID! $state: RoomState!) {
  roomSetState(id: $id, state: $state) {
    ...RoomScalars
  }
}
`;
