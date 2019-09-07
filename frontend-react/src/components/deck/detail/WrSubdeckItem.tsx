import React, { MouseEvent } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK_STUB } from '../../../client-models/WrDeckStub';
import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';
import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';
import { DeckRemoveSubdeck, DeckRemoveSubdeckVariables } from './gqlTypes/DeckRemoveSubdeck';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import Link from '../../../ui/Link';
import HDivider from '../../../ui-components/HDivider';
import { BorderlessButton } from '../../../ui/Button';

const DECK_REMOVE_SUBDECK_MUTATION = gql`
${WR_DECK_STUB}
mutation DeckRemoveSubdeck($id: ID!, $subdeckId: ID!) {
  rwDeckRemoveSubdeck(id: $id, subdeckId: $subdeckId) {
    ...WrDeckStub
  }
}
`;

const StyledItem = styled(Item)`
flex-direction: column;
align-items: stretch;
width: 33%;
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  width: 100%;
}
`;

const DeckSummaryBox = styled.div`
display: flex;
flex-direction: column;
align-items: stretch;
text-align: center;
margin: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[2]} 0 ${({ theme }) => theme.space[2]};
padding: ${({ theme }) => theme.space[3]};
${({ theme }) => theme.fgbg[4]}
:hover, &.active {
  ${({ theme }) => theme.fgbg[2]}
}
`;

const DeckTitle = styled.h4`
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
`;

const HDividerDiv = styled.div`
display: flex;
flex-direction: column;
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
padding: 0;
`;

const DeckStatisticsList = styled(List)`
align-items: center;
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
`;

const ActionsList = styled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: stretch;
justify-content: center;
`;

const ActionItem = styled(Item)`
align-items: center;
padding: ${({ theme }) => theme.space[1]};
`;

const StyledButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[1]};
`;

const StyledLink = styled(Link)`
padding: ${({ theme }) => theme.space[1]};
`;

interface OwnProps {
  deck: WrDeckDetail;
  subdeck: WrDeck;
}

type Props = OwnProps;

const WrSubdeckItem = ({ deck: { id }, subdeck: { id: subdeckId, name, subdecks, cards } }: Props) => {
  const [mutate] = useMutation<DeckRemoveSubdeck, DeckRemoveSubdeckVariables>(
    DECK_REMOVE_SUBDECK_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate({
      variables: { id, subdeckId },
    });
  };
  return (
    <StyledItem key={subdeckId}>
      <DeckSummaryBox>
        <DeckTitle>{name}</DeckTitle>
        <HDividerDiv><HDivider/></HDividerDiv>
        <DeckStatisticsList>
          <Item>
            {subdecks.length} Sub-Decks
          </Item>
          <Item>
            {cards.filter((card) => card.template).length} Template Cards
          </Item>
          <Item>
            {cards.filter((card) => !card.template).length} Cards
          </Item>
        </DeckStatisticsList>
        <HDividerDiv><HDivider/></HDividerDiv>
        <ActionsList>
          <ActionItem>
            <StyledLink to={`/deck/${subdeckId}`}>View</StyledLink>
          </ActionItem>
          <ActionItem>
            <StyledButton onClick={handleClick}>Remove</StyledButton>
          </ActionItem>
        </ActionsList>
      </DeckSummaryBox>
    </StyledItem>
    );
};

export default WrSubdeckItem;
