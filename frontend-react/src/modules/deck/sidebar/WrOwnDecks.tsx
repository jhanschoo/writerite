import React from 'react';

import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { OWN_DECKS_QUERY, OwnDecksData, OwnDecksVariables } from './gql';

import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import WrOwnDecksSH from './WrOwnDecksSH';
import WrDeckList from './WrDeckList';

const renderList = ({
  subscribeToMore, loading, error, data,
}: QueryResult<OwnDecksData, OwnDecksVariables>) => {
  const filter = '';
  if (error) {
    return null;
  }
  if (loading) {
    return (
      <List>
        <Item p={2}><em>Loading...</em></Item>
      </List>
    );
  }
  if (!data || data.rwOwnDecks === undefined || !Array.isArray(data.rwOwnDecks)) {
    return (
      <List>
        <Item p={2}>Error fetching decks!</Item>
      </List>
    );
  }
  if (data.rwOwnDecks.length === 0) {
    return (
      <List>
        <Item p={2}>You have no decks</Item>
      </List>
    );
  }
  const list =  data.rwOwnDecks.filter((deck) => {
    return filter === '' || deck.name.includes(filter);
  });
  return (
    <>
      <WrOwnDecksSH subscribeToMore={subscribeToMore} />
      <WrDeckList decks={list} />
    </>
  );
};

const WrOwnDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Your Decks</SidebarMenuHeader>
      <Query<OwnDecksData, OwnDecksVariables>
        query={OWN_DECKS_QUERY}
        onError={printApolloError}
      >
      {renderList}
      </Query>
    </FlexSection>
  );
};

export default WrOwnDecks;
