import React from "react";

import { useMutation } from "@apollo/client";
import { ROOM_EDIT_OWNER_CONFIG_MUTATION } from "src/gql";
import { RoomDetail, RoomEditOwnerConfigMutation, RoomEditOwnerConfigMutationVariables } from "src/gqlTypes";

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
  return <button onClick={handleClick}>start</button>;
};

export default WrRoomDetailWaitingOwnerConfig;
