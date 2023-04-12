import { client } from "./apolloClient";
import { ROOM_CLEAN_UP_DEAD_MUTATION } from "./gql/mutations";

const HOUR_IN_MS = 1000 * 60 * 60;

// Rooms are cleaned up when they are 2-3 hours old
export const beginRoomCleanupCron = (): void => {
  void client
    .mutate({
      // by server-side implementation, cleans up 2hr-old rooms.
      mutation: ROOM_CLEAN_UP_DEAD_MUTATION,
      // >1hr between cleanups, will drift
    })
    .then(() => setTimeout(beginRoomCleanupCron, HOUR_IN_MS));
};
