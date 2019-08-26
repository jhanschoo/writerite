import React, { useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';
import { DeckDelete, DeckDeleteVariables } from './gqlTypes/DeckDelete';

import styled from 'styled-components';
import { Button } from '../../../ui/Button';
import TextInput from '../../../ui/form/TextInput';

const DECK_DELETE_MUTATION = gql`
mutation DeckDelete($id: ID!) {
  rwDeckDelete(id: $id)
}
`;

interface OwnProps {
  deck: WrDeckDetail;
  disabled?: boolean;
}

type Props = RouteComponentProps & OwnProps;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextInput = styled(TextInput)`
  margin: ${({ theme }) => theme.space[1]} 0;
  width: 100%;
`;

const StyledPanel = styled.div`
  padding:
    0
    ${({ theme }) => theme.space[3]}
    ${({ theme }) => theme.space[3]}
    ${({ theme }) => theme.space[3]};
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const WrDeckDetailDeletePrompt = (props: Props) => {
  const { disabled, history } = props;
  const { id, name } = props.deck;
  const [deletePromptInput, setDeletePromptInput] = useState('');
  const handleDeleteCompleted = () => {
    history.push('/deck');
  };
  const [mutate, { loading }] = useMutation<DeckDelete, DeckDeleteVariables>(
    DECK_DELETE_MUTATION, {
      onError: printApolloError,
      onCompleted: handleDeleteCompleted,
    },
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeletePromptInput(e.target.value);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === 'Escape' || key === 'Esc') {
      e.preventDefault();
      setDeletePromptInput('');
    }
  };
  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        id,
      },
    });
  };
  return (
    <StyledPanel>
      <StyledForm onSubmit={handleDelete}>
        To delete this deck, please type <strong>{name}</strong> in the following box:
        <StyledTextInput
          type="text"
          value={deletePromptInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
        />
        <StyledButton
          type="submit"
          disabled={disabled || loading || deletePromptInput !== name}
        >
          Delete
        </StyledButton>
      </StyledForm>
    </StyledPanel>
  );
};

export default withRouter(WrDeckDetailDeletePrompt);
