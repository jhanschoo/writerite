import React, { FC, MouseEvent } from 'react';
import { Copy } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_CREATE_MUTATION, CardCreateVariables, CardDeleteData as CardCreateData } from './gql';

import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/form/Button';

const StyledButton = styled(AuxillaryButton)`
  margin: 0 ${({ theme }) => theme.space[1]};
`;

type Props = CardCreateVariables;

// TODO: change into a prompt for creating N cards
const WrCreateCardButton: FC<CardCreateVariables> = (props: CardCreateVariables) => {
  const renderCardCreate = (
    mutate: MutationFn<CardCreateData, CardCreateVariables>,
    { loading }: MutationResult<CardCreateData>,
  ) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      return mutate({
        variables: props,
      });
    };
    return (
      <StyledButton
        className="auxillary"
        onClick={handleClick}
      ><Copy size={16} />
      </StyledButton>
    );
  };
  return (
    <Mutation<CardCreateData, CardCreateVariables>
      mutation={CARD_CREATE_MUTATION}
      onError={printApolloError}
    >
    {renderCardCreate}
    </Mutation>
  );
};

export default WrCreateCardButton;
