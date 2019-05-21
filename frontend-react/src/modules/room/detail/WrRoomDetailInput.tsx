import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { ROOM_MESSAGE_CREATE_MUTATION, RoomMessageCreateVariables, RoomMessageCreateData } from '../gql';

import styled from 'styled-components';
import TextInput from '../../../ui/form/TextInput';
import { BorderlessButton } from '../../../ui/form/Button';

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
      });
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setContentInput(e.target.value);
    };
    return (
      <InputBox onSubmit={handleSubmit}>
        <StyledTextInput type="text" value={contentInput} onChange={handleChange} />
        <StyledButton type="submit">
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
