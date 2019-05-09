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
import { Card, Text, Heading, HeadingProps } from 'rebass';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';

import { WrDeckDetail } from '../types';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;

  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }
`;

const StyledButton = styled(Button)`
  display: inline;
  outline: none;
`;

interface OwnProps {
  deck: WrDeckDetail;
}

type Props = HeadingProps & RouteComponentProps & OwnProps;

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
        // typings have onSubmit behave as though it were on an HTMLDivElement,
        // even with as="form"
        // @ts-ignore
        <Text as="form" color="fg2" textAlign="center" onSubmit={handleDelete}>
          If you really want to delete this deck, please enter the name of the deck first:
          <TextInput
            variant="underscore"
            type="text"
            value={deletePromptInput}
            width="24rem"
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
        </Text>
      );
    };
    const handleCompleted = () => {
      history.push('/deck');
    }
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
      // typings have onSubmit behave as though it were on an HTMLDivElement,
      // even with as="form"
      // @ts-ignore
      <Text as="form" color="fg2" textAlign="center" onSubmit={handleSubmit}>
        Deck name:
        <TextInput
          variant="underscore"
          type="text"
          value={nameInput}
          width="24rem"
          onChange={handleTextChange(setNameInput)}
          onKeyDown={handleKeyDown}
        />,<br />
        Deck name's language:
        <TextInput
          variant="underscore"
          type="text"
          value={nameLangInput}
          width="6rem"
          onChange={handleTextChange(setNameLangInput)}
          onKeyDown={handleKeyDown}
        />,<br />
        Prompt language:
        <TextInput
          variant="underscore"
          type="text"
          value={promptLangInput}
          width="6rem"
          onChange={handleTextChange(setPromptLangInput)}
          onKeyDown={handleKeyDown}
        />
        ,<br />
        Answer language:
        <TextInput
          variant="underscore"
          type="text"
          value={answerLangInput}
          width="4rem"
          onChange={handleTextChange(setAnswerLangInput)}
          onKeyDown={handleKeyDown}
        />.<br />
        <StyledButton
          variant="minimal"
          type="submit"
        >
          Save Changes
        </StyledButton>
      </Text>
    ) : undefined;
    return (
      <>
        <Heading m={1} textAlign="center" fontSize="250%">
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
        </Heading>
        {deletePrompt}
        {settingsPanel}
      </>
    );
  };
  return (
    <StyledCard as="header" px={[2, 2, '12.5%']} py={[1, 1, 2]}>
      <Mutation<DeckEditData, DeckEditVariables>
        mutation={DECK_EDIT_MUTATION}
        onError={printApolloError}
      >
        {renderName}
      </Mutation>
    </StyledCard>
  );
};

export default withRouter<Props>(WrDetailHeader);
