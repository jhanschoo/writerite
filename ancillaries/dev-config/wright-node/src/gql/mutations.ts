import gql from "graphql-tag";
import { CHAT_MSG_SCALARS, ROOM_SCALARS } from "../client-models";

export const ROOM_SET_STATE_MUTATION = gql`
  ${ROOM_SCALARS}
  mutation RoomSetStateMutation($id: ID!, $state: RoomState!) {
    roomSetState(id: $id, state: $state) {
      ...RoomScalars
    }
  }
`;

export const CHAT_MSG_CREATE_MUTATION = gql`
  ${CHAT_MSG_SCALARS}
  mutation ChatMsgCreateMutation(
    $roomId: ID!
    $type: ChatMsgContentType!
    $content: JSON!
  ) {
    chatMsgCreate(content: $content, roomId: $roomId, type: $type) {
      ...ChatMsgScalars
    }
  }
`;

export const ROOM_CLEAN_UP_DEAD_MUTATION = gql`
  mutation RoomCleanUpDeadMutation {
    roomCleanUpDead
  }
`;
