import React from "react";

import { RoomDetail, UserScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";

import WrRoomDetailDeckInfo from "./WrRoomDetailDeckInfo";
import WrRoomDetailOccupantsInfo from "./WrRoomDetailOccupantsInfo";

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
  const { occupants } = room;
  const filteredOccupants = occupants?.filter((occupant): occupant is UserScalars => Boolean(occupant));
  return <DashBox>
    <WrRoomDetailDeckInfo deckId={deckId} />
    {filteredOccupants && <WrRoomDetailOccupantsInfo occupants={filteredOccupants} />}
  </DashBox>;
};

export default WrRoomDetailDash;

