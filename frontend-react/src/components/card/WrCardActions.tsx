import React, { MouseEvent } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_CARD } from '../../client-models';
import { CardCreate, CardCreateVariables } from './gqlTypes/CardCreate';
import { CardDelete, CardDeleteVariables } from './gqlTypes/CardDelete';
import { WrCard } from '../../client-models/gqlTypes/WrCard';

import styled from 'styled-components';
import List from '../../ui/list/List';
import Item from '../../ui/list/Item';
import { BorderlessButton } from '../../ui/Button';

const CARD_CREATE_MUTATION = gql`
${WR_CARD}
mutation CardCreate(
  $deckId: ID!,
  $prompt: String!,
  $fullAnswer: String!,
  $sortKey: String,
  $template: Boolean,
) {
  rwCardCreate(
    deckId: $deckId,
    prompt: $prompt,
    fullAnswer: $fullAnswer,
    sortKey: $sortKey,
    template: $template,
  ) {
    ...WrCard
  }
}
`;

const CARD_DELETE_MUTATION = gql`
mutation CardDelete($id: ID!) {
  rwCardDelete(id: $id)
}
`;

const CardActionButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[1]};
text-transform: lowercase;
`;

interface Props {
  editActive: boolean;
  toggleEdit: () => void;
  deckId: string;
  card: WrCard;
}

const WrCardActions = ({ editActive, toggleEdit, deckId, card }: Props) => {
  const { id } = card;
  const [cardCreate] = useMutation<CardCreate, CardCreateVariables>(
    CARD_CREATE_MUTATION, {
      onError: printApolloError,
    },
  );
  const [cardDelete] = useMutation<CardDelete, CardDeleteVariables>(
    CARD_DELETE_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleEditButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleEdit();
  };
  const handleCardCreate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return cardCreate({
      variables: { deckId, ...card },
    });
  };
  const handleCardDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return cardDelete({
      variables: { id },
    });
  };
  return (
    <List>
      <Item>
        <CardActionButton
          className={editActive ? 'active' : undefined}
          onClick={handleEditButton}
        >Edit
        </CardActionButton>
      </Item>
      <Item>
        <CardActionButton
          onClick={handleCardCreate}
        >Duplicate
        </CardActionButton>
      </Item>
      <Item>
        <CardActionButton
          onClick={handleCardDelete}
        >Delete
        </CardActionButton>
      </Item>
    </List>
  );
};

export default WrCardActions;
