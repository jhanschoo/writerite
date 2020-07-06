import React, { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_CARD } from '../../client-models';
import { CardsCreate, CardsCreateVariables } from './gqlTypes/CardsCreate';

import styled from 'styled-components';
import { BorderlessButton } from '../../ui/Button';
import TextInput from '../../ui/TextInput';

const CARDS_CREATE_MUTATION = gql`
${WR_CARD}
mutation CardsCreate(
  $deckId: ID!,
  $prompt: String!,
  $fullAnswer: String!,
  $sortKey: String,
  $template: Boolean,
  $multiplicity: Int!
) {
  cardsCreate(
    deckId: $deckId,
    prompt: $prompt,
    fullAnswer: $fullAnswer,
    sortKey: $sortKey,
    template: $template,
    multiplicity: $multiplicity,
  ) {
    ...WrCard
  }
}
`;

const CenteredFlex = styled.div`
align-self: center;
display: flex;
align-items: baseline;
justify-content: center;
padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
border: 1px solid ${({ theme }) => theme.edge[1]};
margin: 0 0 ${({ theme }) => theme.space[1]} 0;
`;

const StyledTextInput = styled(TextInput)`
margin: 0 ${({ theme }) => theme.space[2]};
flex-grow: 0;
width: 4rem;
`;

const StyledButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[1]};
`;

interface Props {
  deckId: string;
}

const WrNewCardPrompt = ({ deckId }: Props) => {
  const [multiplicity, setMultiplicity] = useState(1);
  const resetMultiplicity = () => setMultiplicity(1);
  const [mutate, { loading }] = useMutation<CardsCreate, CardsCreateVariables>(
    CARDS_CREATE_MUTATION, {
      onError: printApolloError,
      onCompleted: resetMultiplicity,
    },
  );
  const handleUpdate = () => {
    return mutate({
      variables: {
        deckId,
        prompt: '',
        fullAnswer: '',
        multiplicity,
      },
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMultiplicity(parseInt(e.target.value, undefined));
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement> ) => {
    e.preventDefault();
    handleUpdate();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      e.preventDefault();
      handleUpdate();
    }
  };
  return (
    <CenteredFlex>
      Add
      <StyledTextInput
        type="number"
        min="1"
        max="100"
        aria-label="Create this number of new cards"
        value={multiplicity}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      new cards to the deck.&emsp;
      <StyledButton
        onClick={handleClick}
        disabled={loading}
      >Add
      </StyledButton>
    </CenteredFlex>
  );
};

export default WrNewCardPrompt;
