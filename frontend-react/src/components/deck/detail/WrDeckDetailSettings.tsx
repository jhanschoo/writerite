import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK } from '../../../client-models';
import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';
import { DeckEdit, DeckEditVariables } from './gqlTypes/DeckEdit';

import styled from 'styled-components';
import { Button } from '../../../ui/Button';
import TextInput from '../../../ui/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

const DECK_EDIT_MUTATION = gql`
${WR_DECK}
mutation DeckEdit(
    $id: ID!
    $name: String
    $description: String
    $promptLang: String
    $answerLang: String
  ) {
  deckEdit(
    id: $id
    name: $name
    description: $description
    promptLang: $promptLang
    answerLang: $answerLang
  ) {
    ...WrDeck
  }
}
`;

const StyledForm = styled.form`
display: flex;
flex-direction: column;
align-items: center;
`;

const StyledPanel = styled.div`
padding:
  0
  ${({ theme }) => theme.space[3]}
  ${({ theme }) => theme.space[3]}
  ${({ theme }) => theme.space[3]};
text-align: center;
`;

const StyledList = styled(List)`
flex-direction: column;
align-self: stretch;
`;

const StyledItem = styled(Item)`
flex-direction: column;
align-items: flex-start;
padding: ${({ theme }) => theme.space[1]} 0;
`;

const StyledLabel = styled.label`
font-size: 87.5%;
padding: 0 ${({ theme }) => theme.space[2]};
`;

const StyledTextInput = styled(TextInput)`
margin: ${({ theme }) => theme.space[1]} 0;
width: 100%;
`;

const StyledButton = styled(Button)`
margin-top: ${({ theme }) => theme.space[2]};
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

interface Props {
  deck: WrDeckDetail;
  disabled?: boolean;
}

const WrDetailSettings = ({ disabled, deck: { id, name, promptLang, answerLang } }: Props) => {
  const [nameInput, setNameInput] = useState(name);
  const [promptLangInput, setPromptLangInput] = useState(promptLang);
  const [answerLangInput, setAnswerLangInput] = useState(answerLang);
  const [mutate, { loading }] = useMutation<DeckEdit, DeckEditVariables>(
    DECK_EDIT_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleTextChange = (setter: Dispatch<SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
  const resetState = () => {
    setNameInput(name);
    setPromptLangInput(promptLang);
    setAnswerLangInput(answerLang);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === 'Escape' || key === 'Esc') {
      e.preventDefault();
      resetState();
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        id,
        name: nameInput,
        promptLang: promptLangInput,
        answerLang: answerLangInput,
      },
    });
  };
  return (
    <StyledPanel>
      <StyledForm onSubmit={handleSubmit}>
        <StyledList>
          <StyledItem>
            <StyledLabel htmlFor="name-input">
            Deck name
            </StyledLabel>
            <StyledTextInput
              type="text"
              id="name-input"
              value={nameInput}
              onChange={handleTextChange(setNameInput)}
              onKeyDown={handleKeyDown}
              disabled={disabled || loading}
            />
          </StyledItem>
          <StyledItem>
            <StyledLabel htmlFor="prompt-lang-input">
            Prompt language code
            </StyledLabel>
            <StyledTextInput
              type="text"
              id="prompt-lang-input"
              value={promptLangInput}
              onChange={handleTextChange(setPromptLangInput)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </StyledItem>
          <StyledItem>
            <StyledLabel htmlFor="answer-lang-input">
            Answer language code
            </StyledLabel>
            <StyledTextInput
              type="text"
              id="answer-lang-input"
              value={answerLangInput}
              onChange={handleTextChange(setAnswerLangInput)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </StyledItem>
        </StyledList>
        <StyledButton
          type="submit"
          disabled={loading}
        >
          Save Changes
        </StyledButton>
      </StyledForm>
    </StyledPanel>
  );
};

export default WrDetailSettings;
