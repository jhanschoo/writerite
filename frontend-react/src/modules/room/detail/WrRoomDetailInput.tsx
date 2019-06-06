import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send } from 'react-feather';

import { gql } from 'graphql.macro';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import TextInput from '../../../ui/form/TextInput';
import { BorderlessButton } from '../../../ui/form/Button';

import { WrRoomMessage, IWrRoomMessage } from '../../../models/WrRoomMessage';

const ROOM_MESSAGE_CREATE_MUTATION = gql`
mutation RoomMessageCreate(
  $roomId: ID!
  $content: String!
) {
  rwRoomMessageCreate(
    roomId: $roomId
    content: $content
  ) {
    ...WrRoomMessage
  }
}
${WrRoomMessage}
`;

interface RoomMessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
}

interface RoomMessageCreateData {
  readonly rwRoomMessageCreate: IWrRoomMessage | null;
}

interface Props {
  roomId: string;
}

const InputBox = styled.form`
  display: flex;
  padding: ${({ theme }) => theme.space[2]};
  align-items: center;
`;

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`;

const StyledButton = styled(BorderlessButton)`
  padding: ${({ theme }) => theme.space[1]};
  margin: ${({ theme }) => theme.space[1]};
`;

const WrRoomDetailInput = (props: Props) => {
  const { roomId } = props;
  const [contentInput, setContentInput] = useState('');
  const renderInputBox = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
    { loading }: MutationResult<RoomMessageCreateData>,
  ) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutate({
        variables: {
          roomId,
          content: contentInput,
        },
      }).then(() => setContentInput(''));
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setContentInput(e.target.value);
    };
    return (
      <InputBox onSubmit={handleSubmit}>
        <StyledTextInput
          type="text"
          value={contentInput}
          onChange={handleChange}
          disabled={loading}
        />
        <StyledButton type="submit" disabled={loading}>
          Send&nbsp;<Send size={16} />
        </StyledButton>
      </InputBox>
    );
  };
  return (
    <Mutation<RoomMessageCreateData, RoomMessageCreateVariables>
      mutation={ROOM_MESSAGE_CREATE_MUTATION}
      onError={printApolloError}
    >
      {renderInputBox}
    </Mutation>
  );
};

export default WrRoomDetailInput;
