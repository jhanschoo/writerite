import React from 'react';
import { Eye, Play, Copy, Trash } from 'react-feather';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK } from '../../../client-models';
import { OwnDecks } from './gqlTypes/OwnDecks';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import HDivider from '../../../ui/HDivider';
import { AuxillaryButton } from '../../../ui/Button';
import TextTooltip from '../../../ui/TextTooltip';

const OWN_DECKS_QUERY = gql`
${WR_DECK}
query OwnDecks {
  rwOwnDecks {
    ...WrDeck
  }
}
`;

const StyledList = styled(List)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledItem = styled(Item)`
  flex-direction: column;
  align-items: stretch;
  width: 33.33%;
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 100%;
  }
`;

const DeckSummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  margin: 0 ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.transparent};
  padding: ${({ theme }) => theme.space[3]};
  .auxillary {
    visibility: hidden;
  }
  :hover, &.active {
    border: 1px solid ${({ theme }) => theme.colors.lightEdge};
    background: ${({ theme }) => theme.colors.bg1};
  }

  :hover .auxillary {
    visibility: visible;
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
  align-items: stretch;
  justify-content: center;
`;

const ActionItem = styled(Item)`
  align-items: center;
  padding: ${({ theme }) => theme.space[1]};
`;

const WrOrganizeDecks = () => {
  const {
    subscribeToMore, loading, error, data,
  } = useQuery<OwnDecks>(OWN_DECKS_QUERY, {
    onError: printApolloError,
  });
  if (error) {
    return (<Main/>);
  }
  if (loading || !data || (data.rwOwnDecks === null)) {
    return (<Main><p>Fetching decks...</p></Main>);
  }
  if (data.rwOwnDecks.length === 0) {
    return (<Main><p>You have no decks.</p></Main>);
  }
  const styledDecks = data.rwOwnDecks.map((deck) => (
    <StyledItem key={deck.id}>
      <DeckSummaryBox>
        <DeckTitle>{deck.name}</DeckTitle>
        <HDividerDiv><HDivider/></HDividerDiv>
        <DeckStatisticsList>
          <Item>
            0 Sub-Decks
          </Item>
          <Item>
            {deck.cards.filter((card) => card.template).length} Template Cards
          </Item>
          <Item>
          {deck.cards.filter((card) => !card.template).length} Cards
          </Item>
        </DeckStatisticsList>
        <HDividerDiv><HDivider/></HDividerDiv>
        <ActionsList>
          <ActionItem>
            <TextTooltip text="View">
              <AuxillaryButton aria-label="View" className="auxillary"><Eye/></AuxillaryButton>
            </TextTooltip>
          </ActionItem>
          <ActionItem>
            <TextTooltip text="Serve">
              <AuxillaryButton aria-label="Serve" className="auxillary"><Play/></AuxillaryButton>
            </TextTooltip>
          </ActionItem>
          <ActionItem>
            <TextTooltip text="Duplicate">
              <AuxillaryButton aria-label="Duplicate" className="auxillary"><Copy/></AuxillaryButton>
            </TextTooltip>
          </ActionItem>
          <ActionItem>
            <TextTooltip text="Delete">
              <AuxillaryButton aria-label="Delete" className="auxillary"><Trash/></AuxillaryButton>
            </TextTooltip>
          </ActionItem>
        </ActionsList>
      </DeckSummaryBox>
    </StyledItem>
  ));
  return (
    <Main>
      <StyledList>
        {styledDecks}
      </StyledList>
    </Main>
  );
};

export default WrOrganizeDecks;
