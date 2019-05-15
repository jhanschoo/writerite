import React, { useState, FC, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { Plus } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARDS_CREATE_MUTATION, CardsCreateVariables, CardsCreateData } from './gql';

import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/form/Button';
import TextInput from '../../ui/form/TextInput';

const CenteredFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.fg2}
`;

const StyledTextInput = styled(TextInput)`
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
  const renderCardCreate = (
    mutate: MutationFn<CardsCreateData, CardsCreateVariables>,
    { loading }: MutationResult<CardsCreateData>,
  ) => {
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
  return (
    <Mutation<CardsCreateData, CardsCreateVariables>
      mutation={CARDS_CREATE_MUTATION}
      onError={printApolloError}
      onCompleted={resetMultiplicity}
    >
    {renderCardCreate}
    </Mutation>
  );
};

export default WrNewCardPrompt;
