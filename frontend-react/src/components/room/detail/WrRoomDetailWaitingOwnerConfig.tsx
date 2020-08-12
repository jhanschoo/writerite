import React from "react";

import { useMutation } from "@apollo/client";
import { ROOM_EDIT_OWNER_CONFIG_MUTATION } from "src/gql";
import { RoomDetail, RoomEditOwnerConfigMutation, RoomEditOwnerConfigMutationVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";

const ConfigBox = wrStyled.div`
display: flex;
flex-direction: column;
align-items: stretch;
margin: ${({ theme: { space } }) => `0 ${space[3]} 0 0`};

h3 {
  margin: ${({ theme: { space } }) => `${space[2]}`};
}
`;

interface Props {
  room: RoomDetail;
}

const WrRoomDetailWaitingOwnerConfig = ({ room }: Props): JSX.Element => {
  const [mutate] = useMutation<RoomEditOwnerConfigMutation, RoomEditOwnerConfigMutationVariables>(ROOM_EDIT_OWNER_CONFIG_MUTATION);
  const handleClick = () => mutate({ variables: {
    id: room.id,
    ownerConfig: {
      ...room.ownerConfig,
      requestServing: true,
    },
  } });
  return <>
    <ConfigBox>
      <h3>Room Settings</h3>
    </ConfigBox>
    <button onClick={handleClick}>start</button>
  </>;
};

export default WrRoomDetailWaitingOwnerConfig;
