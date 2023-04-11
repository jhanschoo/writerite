import "./assertConfig";
import { client } from "./apolloClient";

import { RoomsUpdatesSubscription } from "./gql/gqlTypes/RoomsUpdatesSubscription";
import { ROOMS_UPDATES_SUBSCRIPTION } from "./gql/subscription";
import { FetchResult } from "@apollo/client";
import { RoomState, UpdateType } from "./gqlGlobalTypes";

import { serveRoom } from "./serveRoom";
import { Ref } from "./types";
import { beginRoomCleanupCron } from "./setServedCron";

const { GRAPHQL_WS } = process.env;

const currentRooms = new Set<string>();

// TODO: parametrize into envvar
const TIME_LIMIT = 1000 * 60 * 60;

void client.subscribe<RoomsUpdatesSubscription>({
  query: ROOMS_UPDATES_SUBSCRIPTION,
}).subscribe({
  error: (e) => {
    throw e;
  },
  // eslint-disable-next-line no-console
  next: async ({ data }: FetchResult<RoomsUpdatesSubscription>) => {
    if (!data?.roomsUpdates?.data?.ownerConfig.requestServing) {
      return null;
    }
    const { type, data: { id, state } } = data.roomsUpdates;
    // guard against repeated and invalid starts
    if (type === UpdateType.DELETED || state !== RoomState.WAITING || currentRooms.has(id)) {
      return null;
    }
    currentRooms.add(id);
    const cancel: Ref<boolean> = [false];
    const servedP = serveRoom(id, cancel);

    /*
     * simple-logic stanza to close rooms after
     * timeout, self-correcting against failed
     * state in case room logic is bugged.
     */
    setTimeout(() => {
      if (currentRooms.has(id)) {
        currentRooms.delete(id);
        cancel[0] = true;
      }
    }, TIME_LIMIT);
    await servedP;
    currentRooms.delete(id);
  },
});
// eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
console.log(`Initiated subscription to rooms from ${GRAPHQL_WS as string}`);

beginRoomCleanupCron();
// eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
console.log("Spun off cron to cleanup dead serving rooms.");
