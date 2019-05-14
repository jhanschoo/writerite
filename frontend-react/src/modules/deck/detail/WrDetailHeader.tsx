import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, Dispatch, SetStateAction } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Settings, Trash2 } from 'react-feather';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import {
  DeckEditData, DeckEditVariables, DECK_EDIT_MUTATION,
  DeckDeleteData, DeckDeleteVariables, DECK_DELETE_MUTATION,
} from '../gql';

import styled from 'styled-components';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';

import { WrDeckDetail } from '../types';

const DeckHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }

  padding: ${({ theme }) => theme.space[2]} 12.5%;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  }
`;

const StyledButton = styled(Button)`
  display: inline;
  outline: none;
`;

const StyledForm = styled.form`
  color: ${({ theme }) => theme.colors.fg2}
  text-align: center;
`;

const DeckHeading = styled.h2`
  margin: ${({ theme }) => theme.space[1]};
  text-align: center;
  font-size: 250%;
`;

const LongTextInput = styled(TextInput)`
  width: 24rem;
`;

const ShortTextInput = styled(TextInput)`
  width: 6rem;
`;

interface OwnProps {
  deck: WrDeckDetail;
}

type Props = RouteComponentProps & OwnProps;

const WrDetailHeader = (props: Props) => {
  const { history } = props;
  const { id, name, nameLang, promptLang, answerLang } = props.deck;
  const [nameInput, setNameInput] = useState(name);
  const [deletePromptInput, setDeletePromptInput] = useState('');
  const [nameLangInput, setNameLangInput] = useState(nameLang);
  const [promptLangInput, setPromptLangInput] = useState(promptLang);
  const [answerLangInput, setAnswerLangInput] = useState(answerLang);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const handleTextChange = (setter: Dispatch<SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
  const toggleBoolean = (current: boolean, setter: Dispatch<SetStateAction<boolean>>) =>
    (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setter(!current);
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
  const renderName = (
    mutate: MutationFn<DeckEditData, DeckEditVariables>,
    { loading }: MutationResult<DeckEditData>,
  ) => {
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
    const renderDeletePrompt = (
      deleteMutate: MutationFn<DeckDeleteData, DeckDeleteVariables>,
      { loading: deleteLoading }: MutationResult<DeckDeleteData>,
    ) => {
      const handleDelete = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteMutate({
          variables: {
            id,
          },
        });
      };
      return (
        <StyledForm onSubmit={handleDelete}>
          If you really want to delete this deck, please type in the name of the deck:
          <LongTextInput
            variant="borderless"
            type="text"
            value={deletePromptInput}
            onChange={handleTextChange(setDeletePromptInput)}
            onKeyDown={handleKeyDown}
          />.&nbsp;
          <StyledButton
            variant="minimal"
            type="submit"
            disabled={deletePromptInput !== name}
          >
            Delete
          </StyledButton>
        </StyledForm>
      );
    };
    const handleCompleted = () => {
      history.push('/deck');
    };
    const deletePrompt = (showDeletePrompt) ? (
      <Mutation<DeckDeleteData, DeckDeleteVariables>
        mutation={DECK_DELETE_MUTATION}
        onError={printApolloError}
        onCompleted={handleCompleted}
      >
        {renderDeletePrompt}
      </Mutation>
    ) : undefined;
    const settingsPanel = (showSettings) ? (
      <StyledForm onSubmit={handleSubmit}>
        Deck name:
        <LongTextInput
          variant="borderless"
          type="text"
          value={nameInput}
          onChange={handleTextChange(setNameInput)}
          onKeyDown={handleKeyDown}
        />,<br />
        Deck name's language:
        <ShortTextInput
          variant="borderless"
          type="text"
          value={nameLangInput}
          onChange={handleTextChange(setNameLangInput)}
          onKeyDown={handleKeyDown}
        />,<br />
        Prompt language:
        <ShortTextInput
          variant="borderless"
          type="text"
          value={promptLangInput}
          onChange={handleTextChange(setPromptLangInput)}
          onKeyDown={handleKeyDown}
        />
        ,<br />
        Answer language:
        <ShortTextInput
          variant="borderless"
          type="text"
          value={answerLangInput}
          onChange={handleTextChange(setAnswerLangInput)}
          onKeyDown={handleKeyDown}
        />.<br />
        <StyledButton
          variant="anchor"
          type="submit"
        >
          Save Changes
        </StyledButton>
      </StyledForm>
    ) : undefined;
    return (
      <>
        <DeckHeading>
          {name}
          <StyledButton
            variant="auxillary"
            className="auxillary"
            onClick={toggleBoolean(showSettings, setShowSettings)}
          >
            <Settings size={16} />
          </StyledButton>
          <StyledButton
            variant="auxillary"
            className="auxillary"
            onClick={toggleBoolean(showDeletePrompt, setShowDeletePrompt)}
          >
            <Trash2 size={16} />
          </StyledButton>
        </DeckHeading>
        {deletePrompt}
        {settingsPanel}
      </>
    );
  };
  return (
    <DeckHeader>
      <Mutation<DeckEditData, DeckEditVariables>
        mutation={DECK_EDIT_MUTATION}
        onError={printApolloError}
      >
        {renderName}
      </Mutation>
    </DeckHeader>
  );
};

export default withRouter<Props>(WrDetailHeader);
