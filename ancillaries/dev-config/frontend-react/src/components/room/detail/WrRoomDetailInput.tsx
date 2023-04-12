import React, { ChangeEvent, FormEvent, useRef, useState } from "react";

import { useMutation } from "@apollo/client";
import { CHAT_MSG_CREATE_MUTATION } from "src/gql";
import {
  ChatMsgContentType,
  ChatMsgCreateMutation,
  ChatMsgCreateMutationVariables,
} from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Button, TextInput } from "src/ui";

const StyledForm = wrStyled.form`
display: flex;
flex-direction: column;
align-items: stretch;
padding: ${({ theme: { space } }) => `${space[3]} 0 ${space[3]} 0`};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const InputRow = wrStyled.div`
display: flex;
align-items: stretch;
padding: ${({ theme: { space } }) => `0 ${space[3]}`};
`;

const StyledLabel = wrStyled.label`
margin: 0 ${({ theme: { space } }) => space[3]};
padding: 0 ${({ theme: { space } }) => space[2]};
font-size: 87.5%;
`;

const StyledTextInput = wrStyled(TextInput)`
flex-grow: 1;
margin: ${({ theme: { space } }) => `0 ${space[1]} 0 0`};
`;

const StyledSubmit = wrStyled(Button)`
margin: ${({ theme: { space } }) => `0 0 0 ${space[1]}`};
padding: ${({ theme: { space } }) => `0 ${space[3]}`};
`;

interface Props {
  roomId: string;
}

const WrRoomDetailInput = ({ roomId }: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const inputEl = useRef<HTMLInputElement>(null);
  const [mutate, { loading }] = useMutation<
    ChatMsgCreateMutation,
    ChatMsgCreateMutationVariables
  >(CHAT_MSG_CREATE_MUTATION);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !inputValue.trim()) {
      return;
    }
    void mutate({
      variables: {
        roomId,
        type: ChatMsgContentType.TEXT,
        content: inputValue.trim(),
      },
    });
    setInputValue("");
    inputEl.current?.focus();
  };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledLabel>Add a message</StyledLabel>
      <InputRow>
        <StyledTextInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type an answer..."
          ref={inputEl}
        />
        <StyledSubmit type="submit" disabled={loading}>
          Send
        </StyledSubmit>
      </InputRow>
    </StyledForm>
  );
};

export default WrRoomDetailInput;
