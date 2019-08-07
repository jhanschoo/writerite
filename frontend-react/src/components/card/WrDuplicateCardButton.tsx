import React, { FC, MouseEvent } from 'react';
import { Copy } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WrCard, IWrCard } from '../../models/WrCard';

import CardAuxillaryButton from './CardAuxillaryButton';

const CARD_CREATE_MUTATION = gql`
${WrCard}
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

interface CardCreateVariables {
  readonly deckId: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey?: string;
  readonly template?: boolean;
}

interface CardCreateData {
  readonly rwCardCreate: IWrCard | null;
}

type Props = CardCreateVariables;

const WrDuplicateCardButton: FC<Props> = (props: Props) => {
  const [mutate, { loading }] = useMutation<CardCreateData, CardCreateVariables>(
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
