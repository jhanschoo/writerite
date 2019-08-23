import React from 'react';

import { gql } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK } from '../../../client-models/WrDeck';
import { OwnDecks } from './gqlTypes/OwnDecks';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import WrOwnDecksSH from './WrOwnDecksSH';
import WrDeckList from './WrDeckList';

const OWN_DECKS_QUERY = gql`
${WR_DECK}
query OwnDecks {
  rwOwnDecks {
    ...WrDeck
  }
}
`;

const PaddedItem = styled(Item)`
  padding: ${({ theme }) => theme.space[2]}
`;

const WrOwnDecks = () => {
  const {
    subscribeToMore, loading, error, data,
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
  if (!data || !data.rwOwnDecks) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
        <List>
          <PaddedItem>Error fetching decks!</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  if (data.rwOwnDecks.length === 0) {
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
      <WrOwnDecksSH subscribeToMore={subscribeToMore} />
      <WrDeckList decks={data.rwOwnDecks} />
    </FlexSection>
  );
};

export default WrOwnDecks;
