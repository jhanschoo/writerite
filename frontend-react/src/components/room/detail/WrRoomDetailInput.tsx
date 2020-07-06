import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send } from 'react-feather';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { ChatMsgCreate, ChatMsgCreateVariables } from './gqlTypes/ChatMsgCreate';
import { ChatMsgContentType } from '../../../gqlGlobalTypes';

import styled from 'styled-components';
import TextInput from '../../../ui/TextInput';
import { BorderlessButton } from '../../../ui/Button';

import { WR_CHAT_MSG } from '../../../client-models';

const CHAT_MSG_CREATE_MUTATION = gql`
${WR_CHAT_MSG}
mutation ChatMsgCreate(
  $roomId: ID!
  $type: ChatMsgContentType!
  $content: String!
) {
  chatMsgCreate(
    roomId: $roomId
    type: $type
    content: $content
  ) {
    ...WrChatMsg
  }
}
`;

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

interface Props {
  roomId: string;
}

const WrRoomDetailInput = ({ roomId }: Props) => {
  const [contentInput, setContentInput] = useState('');
  const [
    mutate, { loading },
  ] = useMutation<ChatMsgCreate, ChatMsgCreateVariables>(
    CHAT_MSG_CREATE_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        roomId,
        content: contentInput,
        type: ChatMsgContentType.TEXT,
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
