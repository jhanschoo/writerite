import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import { Button } from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

import { WrDeck, IWrDeck } from '../../../client-models/WrDeck';

const DECK_EDIT_MUTATION = gql`
${WrDeck}
mutation DeckEdit(
    $id: ID!
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
  ) {
  rwDeckEdit(
    id: $id
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
  ) {
    ...WrDeck
  }
}
`;

interface DeckEditVariables {
  readonly id: string;
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
}

interface DeckEditData {
  readonly rwDeckEdit: IWrDeck | null;
}

interface Props {
  deck: IWrDeck;
  disabled?: boolean;
}

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

const WrDetailSettings = (props: Props) => {
  const { disabled } = props;
  const { id, name, nameLang, promptLang, answerLang } = props.deck;
  const [nameInput, setNameInput] = useState(name);
  const [nameLangInput, setNameLangInput] = useState(nameLang);
  const [promptLangInput, setPromptLangInput] = useState(promptLang);
  const [answerLangInput, setAnswerLangInput] = useState(answerLang);
  const [mutate, { loading }] = useMutation<DeckEditData, DeckEditVariables>(
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
    setNameLangInput(nameLang);
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
        nameLang: nameLangInput,
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
            <StyledLabel htmlFor="name-lang-input">
            Deck name language code
            </StyledLabel>
            <StyledTextInput
              type="text"
              id="name-lang-input"
              value={nameLangInput}
              onChange={handleTextChange(setNameLangInput)}
              onKeyDown={handleKeyDown}
              disabled={loading}
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
