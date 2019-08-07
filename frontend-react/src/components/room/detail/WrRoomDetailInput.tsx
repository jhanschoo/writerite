import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import TextInput from '../../../ui/form/TextInput';
import { BorderlessButton } from '../../../ui/form/Button';

import { WrRoomMessage, IWrRoomMessage } from '../../../models/WrRoomMessage';
import { WrRoomMessageContentType } from '../../../models/WrRoomMessageStub';

const ROOM_MESSAGE_CREATE_MUTATION = gql`
${WrRoomMessage}
mutation RoomMessageCreate(
  $roomId: ID!
  $content: String!
  $contentType: RwRoomMessageContentType!
) {
  rwRoomMessageCreate(
    roomId: $roomId
    content: $content
    contentType: $contentType
  ) {
    ...WrRoomMessage
  }
}
`;

interface RoomMessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
  readonly contentType: WrRoomMessageContentType;
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
  const [
    mutate, { loading },
  ] = useMutation<RoomMessageCreateData, RoomMessageCreateVariables>(
    ROOM_MESSAGE_CREATE_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        roomId,
        content: contentInput,
        contentType: WrRoomMessageContentType.TEXT,
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

export default WrRoomDetailInput;
