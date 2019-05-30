import React, { FC, MouseEvent } from 'react';
import { Copy } from 'react-feather';

import { gql } from 'graphql.macro';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { WrCard, IWrCard } from '../../models/WrCard';

import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/form/Button';

const CARD_CREATE_MUTATION = gql`
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
  ${WrCard}
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

const StyledButton = styled(AuxillaryButton)`
  margin: 0 ${({ theme }) => theme.space[1]};
`;

type Props = CardCreateVariables;

// TODO: change into a prompt for creating N cards
const WrDuplicateCardButton: FC<CardCreateVariables> = (props: CardCreateVariables) => {
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

export default WrDuplicateCardButton;
