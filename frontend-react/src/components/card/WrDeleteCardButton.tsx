import React, { FC, MouseEvent } from 'react';
import { Trash } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';

import CardAuxillaryButton from './CardAuxillaryButton';

const CARD_DELETE_MUTATION = gql`
mutation CardDelete($id: ID!) {
  rwCardDelete(id: $id)
}
`;

interface CardDeleteVariables {
  readonly id: string;
}

interface CardDeleteData {
  readonly rwCardDelete: string | null;
}

interface Props {
  cardId: string;
}

const WrDeleteCardButton: FC<Props> = (props: Props) => {
  const { cardId } = props;
  const [mutate, { loading }] =
    useMutation<CardDeleteData, CardDeleteVariables>(CARD_DELETE_MUTATION, {
      onError: printApolloError,
    });
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return mutate({
      variables: {
        id: cardId,
      },
    });
  };
  return (
    <CardAuxillaryButton
      className="auxillary"
      onClick={handleClick}
      disabled={loading}
    ><Trash size={16} />
    </CardAuxillaryButton>
  );
};

export default WrDeleteCardButton;
