import React, { FC, MouseEvent } from 'react';
import { Trash2 } from 'react-feather';

import { gql } from 'graphql.macro';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';

import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/form/Button';

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

const StyledButton = styled(AuxillaryButton)`
  margin: 0 ${({ theme }) => theme.space[1]};
`;

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
      <StyledButton
        className="auxillary"
        onClick={handleClick}
      ><Trash2 size={16} />
      </StyledButton>
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
