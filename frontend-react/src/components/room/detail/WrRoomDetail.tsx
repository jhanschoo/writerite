import React from "react";

import { wrStyled } from "src/theme";
import { Main } from "src/ui";

import WrRoomNavBar from "../navbar/WrRoomNavBar";
import WrRoomDetailDash from "./WrRoomDetailDash";
import WrRoomDetailInput from "./WrRoomDetailInput";

const EventBox = wrStyled.div`
max-height: 50vh;
`;

const ConversationBox = wrStyled.div`
flex-grow: 1;
flex-shrink: 1;
`;

const WrRoomDetail = (): JSX.Element => {
  return <>
    <WrRoomNavBar />
    <Main>
      <WrRoomDetailDash />
      <ConversationBox />
      <WrRoomDetailInput />
    </Main>
  </>;
};

export default WrRoomDetail;
