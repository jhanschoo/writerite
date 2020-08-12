import gql from "graphql-tag";
import { ROOM_SCALARS } from "../client-models";

export const ROOMS_UPDATES_SUBSCRIPTION = gql`
${ROOM_SCALARS}
subscription RoomsUpdatesSubscription {
  roomsUpdates {
    type
    data {
      ...RoomScalars
    }
  }
}
`;
