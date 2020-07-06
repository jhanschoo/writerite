import React, { useState, FormEvent, ChangeEvent } from 'react';

import { useSelector } from 'react-redux';
import { WrState } from '../../../store';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_ROOM_SCALARS } from '../../../client-models';
import { WrRoomDetail } from '../../../client-models/gqlTypes/WrRoomDetail';
import { RoomUpdateConfig, RoomUpdateConfigVariables } from './gqlTypes/RoomUpdateConfig';

import styled from 'styled-components';
import { Button } from '../../../ui/Button';
import TextInput from '../../../ui/TextInput';
import HDivider from '../../../ui-components/HDivider';

const ROOM_UPDATE_CONFIG_MUTATION = gql`
${WR_ROOM_SCALARS}
mutation RoomUpdateConfig(
  $id: ID!
  $config: RoomConfigInput!
) {
  roomUpdateConfig(
    id: $id
    config: $config
  ) {
    ...WrRoomScalars
  }
}
`;

const StyledForm = styled.form``;

const StyledTextInput = styled(TextInput)``;

const StyledHeader = styled.h4`
text-transform: uppercase;
font-size: 100%;
font-weight: bold;
margin: 0;
padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
`;

const StyledButton = styled(Button)`
display: inline-block;
font-weight: normal;
margin-left: ${({ theme }) => theme.space[2]};
padding: ${({ theme }) => theme.space[1]};
`;

const Field = styled.div`
padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
`;

interface Props {
  room: WrRoomDetail;
}

const WrRoomConfig = ({ room }: Props) => {
  const id = useSelector<WrState, string | null>((state) => state?.signin?.session?.user.id ?? null);
  const [roundLengthInput, setRoundLength] = useState<string>('20');
  const [
    mutate, { loading },
  ] = useMutation<RoomUpdateConfig, RoomUpdateConfigVariables>(
    ROOM_UPDATE_CONFIG_MUTATION, {
      onError: printApolloError,
    },
  );
  if (!id || room.config.clientDone || id !== room.owner?.id) {
    return null;
  }

  // case where config is still open for modification and room owner is
  // this client
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        id: room.id,
        config: Object.assign({}, room.config, {
          roundLength: Number.parseInt(roundLengthInput, 10) * 1000,
          clientDone: true,
          __typename: undefined,
        }),
      },
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoundLength(e.target.value);
  };
  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledHeader>
          Configure Room
          <StyledButton type="submit" disabled={loading}>Accept</StyledButton>
        </StyledHeader>
        <Field>
          Round duration: <StyledTextInput
            type="number"
            id="room-detail-config-round-length"
            onChange={handleChange}
            value={roundLengthInput}
            min="1"
            step="1"
            disabled={loading}
          /> s
        </Field>
      </StyledForm>
      <HDivider />
    </>
  );
};

export default WrRoomConfig;
