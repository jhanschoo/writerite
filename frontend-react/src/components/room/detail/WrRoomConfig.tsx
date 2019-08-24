import React, { useState, FormEvent, ChangeEvent } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../../store';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_ROOM_STUB } from '../../../client-models';
import { WrRoomDetail } from '../../../client-models/gqlTypes/WrRoomDetail';
import { RoomUpdateConfig, RoomUpdateConfigVariables } from './gqlTypes/RoomUpdateConfig';

import styled from 'styled-components';
import { Button } from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import HDivider from '../../../ui/HDivider';

const ROOM_UPDATE_CONFIG_MUTATION = gql`
${WR_ROOM_STUB}
mutation RoomUpdateConfig(
  $id: ID!
  $config: IRoomConfigInput!
) {
  rwRoomUpdateConfig(
    id: $id
    config: $config
  ) {
    ...WrRoomStub
  }
}
`;

interface StateProps {
  id?: string;
}

interface OwnProps {
  room: WrRoomDetail;
}

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

type Props = StateProps & OwnProps;

const WrRoomConfig = (props: Props) => {
  const { id, room } = props;
  const [roundLengthInput, setRoundLength] = useState<string>('20');
  const [
    mutate, { loading },
  ] = useMutation<RoomUpdateConfig, RoomUpdateConfigVariables>(
    ROOM_UPDATE_CONFIG_MUTATION, {
      onError: printApolloError,
    },
  );
  if (room.config.clientDone || id !== room.owner.id) {
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

const mapStateToProps = (state: WrState): StateProps => {
  const id = (state.signin && state.signin.data && state.signin.data.user.id) || undefined;
  return { id };
};

const connectedWrRoomConfig = connect<StateProps, {}, OwnProps>(mapStateToProps)(WrRoomConfig);

export default connectedWrRoomConfig;
