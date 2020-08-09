import React from "react";
import { useHistory } from "react-router";

import { wrStyled } from "src/theme";

const DashBox = wrStyled.div`
max-height: 50vh;
`;

const WrRoomDetailDash = (): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const history = useHistory<{ deckId: string } | null>();
  const { deckId } = history.location.state ?? {};
  return <DashBox>
  </DashBox>;
};

export default WrRoomDetailDash;

