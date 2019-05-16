import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { WrDeckDetail } from '../types';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import {
  DeckEditData, DeckEditVariables, DECK_EDIT_MUTATION,
  DeckDeleteData, DeckDeleteVariables, DECK_DELETE_MUTATION,
} from '../gql';

import styled from 'styled-components';
import { AnchorButton } from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import HDivider from '../../../ui/HDivider';

interface OwnProps {
  deck: WrDeckDetail;
}

type Props = RouteComponentProps & OwnProps;

const StyledTextInput = styled(TextInput)`
  margin: ${({ theme }) => theme.space[1]} 0;
  width: 100%;
`;

const StyledList = styled(List)`
flex-direction: column;
`;

const StyledPanel = styled.div`
background: ${({ theme }) => theme.colors.heterogBg};
color: ${({ theme }) => theme.colors.fg2};
padding: ${({ theme }) => theme.space[3]};
border-radius: 4px;
text-align: center;
`;

const WrDeckDetailPanel = (props: Props) => {
  const { history } = props;
  const { id, name, nameLang, promptLang, answerLang } = props.deck;
  const [nameInput, setNameInput] = useState(name);
  const [deletePromptInput, setDeletePromptInput] = useState('');
  const [nameLangInput, setNameLangInput] = useState(nameLang);
  const [promptLangInput, setPromptLangInput] = useState(promptLang);
  const [answerLangInput, setAnswerLangInput] = useState(answerLang);
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
  const renderPanel = (
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
    return (
        <form onSubmit={handleSubmit}>
          <StyledList>
            <Item>
              Deck name:&nbsp;
              <StyledTextInput
                type="text"
                value={nameInput}
                onChange={handleTextChange(setNameInput)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </Item>
            <Item>
              Deck name's language:&nbsp;
              <StyledTextInput
                type="text"
                value={nameLangInput}
                onChange={handleTextChange(setNameLangInput)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </Item>
            <Item>
              Prompt language:&nbsp;
              <StyledTextInput
                type="text"
                value={promptLangInput}
                onChange={handleTextChange(setPromptLangInput)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </Item>
            <Item>
              Answer language:&nbsp;
              <StyledTextInput
                type="text"
                value={answerLangInput}
                onChange={handleTextChange(setAnswerLangInput)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </Item>
          </StyledList>
          <AnchorButton
            type="submit"
            disabled={loading}
          >
            Save Changes
          </AnchorButton>
        </form>
    );
  };
  const renderDeletePrompt = (
    deleteMutate: MutationFn<DeckDeleteData, DeckDeleteVariables>,
    { loading }: MutationResult<DeckDeleteData>,
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
      <form onSubmit={handleDelete}>
        To delete this deck, please type <strong>{name}</strong> in the following box:
        <StyledTextInput
          type="text"
          value={deletePromptInput}
          onChange={handleTextChange(setDeletePromptInput)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <AnchorButton
          type="submit"
          disabled={loading || deletePromptInput !== name}
        >
          Delete
        </AnchorButton>
      </form>
    );
  };
  const handleDeleteCompleted = () => {
    history.push('/deck');
  };
  return (
    <StyledPanel>
      <Mutation<DeckEditData, DeckEditVariables>
        mutation={DECK_EDIT_MUTATION}
        onError={printApolloError}
      >
        {renderPanel}
      </Mutation>
      <HDivider />
      <Mutation<DeckDeleteData, DeckDeleteVariables>
        mutation={DECK_DELETE_MUTATION}
        onError={printApolloError}
        onCompleted={handleDeleteCompleted}
      >
        {renderDeletePrompt}
      </Mutation>
    </StyledPanel>
  );
};

export default withRouter<Props>(WrDeckDetailPanel);
