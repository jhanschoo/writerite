import React, { FC, MouseEvent } from 'react';
import { Copy } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_CREATE_MUTATION, CardCreateVariables, CardDeleteData as CardCreateData } from './gql';

import Button from '../../ui/form/Button';

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
      <Button
        my={1}
        variant="auxillary"
        className="auxillary"
        onClick={handleClick}
      ><Copy size={16} />
      </Button>
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
