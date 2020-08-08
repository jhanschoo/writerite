import React from "react";
import { useHistory } from "react-router";

import { Main } from "src/ui";
import WrRoomNavBar from "../navbar/WrRoomNavBar";

const WrRoomDetail = (): JSX.Element => {
  const history = useHistory<{ deckId: string } | null>();
  const { deckId } = history.location.state ?? {};
  return <>
    <WrRoomNavBar />
    <Main>{deckId}</Main>
  </>;
};

export default WrRoomDetail;
