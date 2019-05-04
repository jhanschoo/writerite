import React, { FC } from 'react';
import { Plus } from 'react-feather';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_CREATE_MUTATION, CardCreateVariables, CardCreateData } from './gql';

import styled from 'styled-components';
import { Card, Flex } from 'rebass';
import Button from '../../ui/form/Button';

const CenteredCard = styled(Card)`
  align-self: center;
`;

interface Props {
  deckId: string;
}

const NewCardButton: FC<Props> = (props: Props) => {
  const { deckId } = props;
  const renderCardCreate = (
    mutate: MutationFn<CardCreateData, CardCreateVariables>,
    { loading }: MutationResult<CardCreateData>,
  ) => {
    const handleClick = () => {
      return mutate({
        variables: {
          prompt: '',
          fullAnswer: '',
          deckId,
        },
      });
    };
    return (
      <CenteredCard
        m={1}
        px={2}
      >
        <Button variant="default" px={[1, 1, 2]} py={1} onClick={handleClick}>
          <Flex alignItems="center">
            <Plus size={16} />New Card
          </Flex>
        </Button>
      </CenteredCard>
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

export default NewCardButton;
