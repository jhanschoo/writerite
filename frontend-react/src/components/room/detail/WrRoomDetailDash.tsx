import React from "react";

import { useSelector } from "react-redux";
import { WrState } from "src/store";

import { RoomDetail, RoomState, UserScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";

import type { CurrentUser } from "src/types";
import WrRoomDetailDeckInfo from "./WrRoomDetailDeckInfo";
import WrRoomDetailOccupantsInfo from "./WrRoomDetailOccupantsInfo";
import WrRoomDetailWaitingOwnerConfig from "./WrRoomDetailWaitingOwnerConfig";

const DashBox = wrStyled.div`
display: flex;
max-height: 33vh;
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
${({ theme: { fgbg, bg } }) => fgbg(bg[4])}
`;

interface Props {
  room: RoomDetail;
  deckId: string;
}

const WrRoomDetailDash = ({ room, deckId }: Props): JSX.Element => {
  const user = useSelector<WrState, CurrentUser | null>((state) => state.signin?.session?.user ?? null);
  const isOwner = user?.id === room.ownerId;
  const { occupants } = room;
  const filteredOccupants = occupants?.filter((occupant): occupant is UserScalars => Boolean(occupant));
  return <DashBox>
    <WrRoomDetailDeckInfo deckId={deckId} />
    {filteredOccupants && <WrRoomDetailOccupantsInfo occupants={filteredOccupants} />}
    {isOwner && room.state === RoomState.WAITING && <WrRoomDetailWaitingOwnerConfig room={room}/>}
  </DashBox>;
};

export default WrRoomDetailDash;

