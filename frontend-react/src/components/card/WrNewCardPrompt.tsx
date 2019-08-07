import React, { useState, FC, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { Plus } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WrCard, IWrCard } from '../../models/WrCard';

import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/form/Button';
import TextInput from '../../ui/form/TextInput';

const CARDS_CREATE_MUTATION = gql`
${WrCard}
mutation CardCreate(
  $deckId: ID!,
  $prompt: String!,
  $fullAnswer: String!,
  $sortKey: String,
  $template: Boolean,
  $multiplicity: Int!
) {
  rwCardsCreate(
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

interface CardsCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string;
  readonly template?: boolean;
  readonly multiplicity: number;
}

interface CardsCreateData {
  readonly rwCardsCreate: IWrCard[] | null;
}

const CenteredFlex = styled.div`
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  border-radius: 4px;
`;

const StyledTextInput = styled(TextInput)`
  margin: 0 ${({ theme }) => theme.space[2]};
  flex-grow: 0;
  width: 4rem;
`;

interface Props {
  deckId: string;
}

const WrNewCardPrompt: FC<Props> = (props: Props) => {
  const { deckId } = props;
  const [multiplicity, setMultiplicity] = useState(1);
  const resetMultiplicity = () => setMultiplicity(1);
  const [mutate, { loading }] = useMutation<CardsCreateData, CardsCreateVariables>(
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
      new cards to the deck&emsp;
      <AuxillaryButton
        onClick={handleClick}
        disabled={loading}
      ><Plus size={16} />
      </AuxillaryButton>
    </CenteredFlex>
  );
};

export default WrNewCardPrompt;
