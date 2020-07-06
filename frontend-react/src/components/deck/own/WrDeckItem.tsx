// Visually similar to WrDeckDetailSubdeckItem
import React, { MouseEvent } from 'react';

import {withRouter, RouteComponentProps } from 'react-router';

import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';
import { ROOM_CREATE_MUTATION } from '../sharedGql';
import { RoomCreate, RoomCreateVariables } from '../gqlTypes/RoomCreate';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import Link from '../../../ui/Link';
import HDivider from '../../../ui-components/HDivider';
import { BorderlessButton } from '../../../ui/Button';

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
  deck: WrDeck;
}

type Props = OwnProps & RouteComponentProps;

const WrDeckItem = ({ deck, history }: Props) => {
  const handleCompletedCreateRoom = ({ roomCreate }: RoomCreate) => {
    if (!roomCreate) {
      return;
    }
    history.push(`/room/${roomCreate.id}`);
  };
  const [
    mutate,
  ] = useMutation<RoomCreate, RoomCreateVariables>(
      ROOM_CREATE_MUTATION, {
      onError: printApolloError,
      onCompleted: handleCompletedCreateRoom,
    },
  );
  const handleCreateRoom = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        config: {
          deckId: deck.id,
          deckName: deck.name,
        },
      },
    });
  };
  return (
    <StyledItem key={deck.id}>
      <DeckSummaryBox>
        <DeckTitle>{deck.name}</DeckTitle>
        <HDividerDiv><HDivider/></HDividerDiv>
        <DeckStatisticsList>
          <Item>
            {deck.children?.length ?? 0} Sub-Decks
          </Item>
          <Item>
            {deck.cards?.filter((card) => card?.template).length ?? 0} Template Cards
          </Item>
          <Item>
            {deck.cards?.filter((card) => card?.template === false).length ?? 0} Cards
          </Item>
        </DeckStatisticsList>
        <HDividerDiv><HDivider/></HDividerDiv>
        <ActionsList>
          <ActionItem>
            <StyledLink to={`/deck/${deck.id}`}>View</StyledLink>
          </ActionItem>
          <ActionItem>
            <StyledButton onClick={handleCreateRoom}>Serve</StyledButton>
          </ActionItem>
        </ActionsList>
      </DeckSummaryBox>
    </StyledItem>
    );
};

export default withRouter(WrDeckItem);
