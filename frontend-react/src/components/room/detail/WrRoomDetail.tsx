import React from "react";

import { useParams } from "react-router";

import { useQuery } from "@apollo/client";
import { ROOM_DETAIL_QUERY } from "src/gql";
import { RoomDetailQuery, RoomDetailQueryVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Main } from "src/ui";

import WrRoomNavBar from "../navbar/WrRoomNavBar";
import WrRoomDetailDash from "./WrRoomDetailDash";
import WrRoomDetailInput from "./WrRoomDetailInput";

const ConversationBox = wrStyled.div`
flex-grow: 1;
flex-shrink: 1;
`;

const WrRoomDetail = (): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data, error } = useQuery<RoomDetailQuery, RoomDetailQueryVariables>(ROOM_DETAIL_QUERY, {
    variables: { id: roomId },
  });
  if (error) {
    return <>
      <WrRoomNavBar />
      <Main>
        <p>Error retrieving room...</p>
      </Main>
    </>;
  }
  if (!data?.room) {
    return <>
      <WrRoomNavBar />
      <Main>
        <p>Retrieving room...</p>
      </Main>
    </>;
  }
  const { room } = data;
  const deckId = data.room.ownerConfig.deckId as string | undefined;
  return <>
    <WrRoomNavBar />
    <Main>
      {deckId && <WrRoomDetailDash room={room} deckId={deckId} />}
      <ConversationBox />
      <WrRoomDetailInput />
    </Main>
  </>;
};

export default WrRoomDetail;
