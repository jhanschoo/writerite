import React, { FC, MouseEvent } from 'react';
import { Trash } from 'react-feather';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { CardDelete, CardDeleteVariables } from './gqlTypes/CardDelete';

import CardAuxillaryButton from './CardAuxillaryButton';

const CARD_DELETE_MUTATION = gql`
mutation CardDelete($id: ID!) {
  rwCardDelete(id: $id)
}
`;

interface Props {
  cardId: string;
}

const WrDeleteCardButton: FC<Props> = (props: Props) => {
  const { cardId } = props;
  const [mutate, { loading }] = useMutation<CardDelete, CardDeleteVariables>(
    CARD_DELETE_MUTATION, {
      onError: printApolloError,
    },
  );
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
