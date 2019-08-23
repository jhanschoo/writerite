import React, { FC, MouseEvent } from 'react';
import { Copy } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_CARD } from '../../client-models/WrCard';
import { CardCreate, CardCreateVariables } from './gqlTypes/CardCreate';

import CardAuxillaryButton from './CardAuxillaryButton';

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

type Props = CardCreateVariables;

const WrDuplicateCardButton: FC<Props> = (props: Props) => {
  const [mutate, { loading }] = useMutation<CardCreate, CardCreateVariables>(
    CARD_CREATE_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return mutate({
      variables: props,
    });
  };
  return (
    <CardAuxillaryButton
      className="auxillary"
      onClick={handleClick}
      disabled={loading}
    ><Copy size={16} />
    </CardAuxillaryButton>
  );
};

export default WrDuplicateCardButton;
