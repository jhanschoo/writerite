import React, { useEffect } from "react";

import { useParams } from "react-router";

import { useQuery } from "@apollo/client";
import { ROOM_DETAIL_QUERY, ROOM_UPDATES_SUBSCRIPTION } from "src/gql";
import { RoomDetailQuery, RoomDetailQueryVariables } from "src/gqlTypes";

import { Main } from "src/ui";

import WrRoomNavBar from "../navbar/WrRoomNavBar";
import WrRoomDetailChatMsgs from "./WrRoomDetailChatMsgs";
import WrRoomDetailDash from "./WrRoomDetailDash";
import WrRoomDetailInput from "./WrRoomDetailInput";
import {
  RoomUpdatesSubscription,
  RoomUpdatesSubscriptionVariables,
} from "src/gql/gqlTypes/RoomUpdatesSubscription";
import { UpdateType } from "src/gqlGlobalTypes";

const WrRoomDetail = (): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data, error, subscribeToMore } = useQuery<
    RoomDetailQuery,
    RoomDetailQueryVariables
  >(ROOM_DETAIL_QUERY, {
    variables: { id: roomId },
  });
  useEffect(() => {
    subscribeToMore<RoomUpdatesSubscription, RoomUpdatesSubscriptionVariables>({
      document: ROOM_UPDATES_SUBSCRIPTION,
      variables: { id: roomId },
      updateQuery(
        prev,
        {
          subscriptionData: {
            data: { roomUpdates },
          },
        }
      ) {
        switch (roomUpdates?.type) {
          case UpdateType.CREATED:
          // fall through
          case UpdateType.EDITED:
            return { ...prev, room: roomUpdates.data ?? prev.room };
          default:
            return prev;
        }
      },
    });
  }, [roomId, subscribeToMore]);
  if (error) {
    return (
      <>
        <WrRoomNavBar />
        <Main>
          <p>Error retrieving room...</p>
        </Main>
      </>
    );
  }
  if (!data?.room) {
    return (
      <>
        <WrRoomNavBar />
        <Main>
          <p>Retrieving room...</p>
        </Main>
      </>
    );
  }
  const { room } = data;
  const deckId = data.room.ownerConfig.deckId as string | undefined;
  return (
    <>
      <WrRoomNavBar />
      <Main>
        {deckId && <WrRoomDetailDash room={room} deckId={deckId} />}
        <WrRoomDetailChatMsgs roomId={roomId} />
        <WrRoomDetailInput roomId={roomId} />
      </Main>
    </>
  );
};

export default WrRoomDetail;
