import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { OWN_DECKS_QUERY } from '../sharedGql';
import { OwnDecks } from '../gqlTypes/OwnDecks';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import WrDeckList from './WrDeckList';
import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';

const FlexSection = styled.section`
display: flex;
flex-direction: column;
margin-bottom: ${({ theme }) => theme.space[1]};
`;

const PaddedItem = styled(Item)`
padding: ${({ theme }) => theme.space[2]}
`;

const WrOwnDecks = () => {
  const {
    loading, error, data,
  } = useQuery<OwnDecks>(OWN_DECKS_QUERY, {
    onError: printApolloError,
  });
  if (error) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
      </FlexSection>
    );
  }
  if (loading) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
        <List>
          <PaddedItem><em>Loading...</em></PaddedItem>
        </List>
      </FlexSection>
    );
  }
  const decks = data?.ownDecks?.filter((deck): deck is WrDeck => !!deck);
  if (!decks) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
        <List>
          <PaddedItem>Error fetching decks!</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  if (decks.length === 0) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
        <List>
          <PaddedItem>You have no decks</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  return (
    <FlexSection>
      <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
      <WrDeckList decks={decks} />
    </FlexSection>
  );
};

export default WrOwnDecks;
