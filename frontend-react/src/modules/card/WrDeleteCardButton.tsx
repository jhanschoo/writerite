import React, { FC, MouseEvent } from 'react';
import { Trash2 } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_DELETE_MUTATION, CardDeleteVariables, CardDeleteData } from './gql';

import Button from '../../ui/form/Button';

interface Props {
  cardId: string;
}

const WrDeleteCardButton: FC<Props> = (props: Props) => {
  const { cardId } = props;
  const renderCardCreate = (
    mutate: MutationFn<CardDeleteData, CardDeleteVariables>,
    { loading }: MutationResult<CardDeleteData>,
  ) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      return mutate({
        variables: {
          id: cardId,
        },
      });
    };
    return (
      <Button
        mx={1}
        variant="auxillary"
        className="auxillary"
        onClick={handleClick}
      ><Trash2 size={16} />
      </Button>
    );
  };
  return (
    <Mutation<CardDeleteData, CardDeleteVariables>
      mutation={CARD_DELETE_MUTATION}
      onError={printApolloError}
    >
    {renderCardCreate}
    </Mutation>
  );
};

export default WrDeleteCardButton;
