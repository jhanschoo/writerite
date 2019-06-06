import React from 'react';

import { gql } from 'graphql.macro';
import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import { WrDeck, IWrDeck } from '../../../models/WrDeck';
import WrOwnDecksSH from './WrOwnDecksSH';
import WrDeckList from './WrDeckList';

const OWN_DECKS_QUERY = gql`
query OwnDecks {
  rwOwnDecks {
    ...WrDeck
  }
}
${WrDeck}
`;
type OwnDecksVariables = object;

export interface OwnDecksData {
  readonly rwOwnDecks: IWrDeck[] | null;
}

const PaddedItem = styled(Item)`
  padding: ${({ theme }) => theme.space[2]}
`;

const renderList = ({
  subscribeToMore, loading, error, data,
}: QueryResult<OwnDecksData, OwnDecksVariables>) => {
  if (error) {
    return null;
  }
  if (loading) {
    return (
      <List>
        <PaddedItem><em>Loading...</em></PaddedItem>
      </List>
    );
  }
  if (!data || data.rwOwnDecks === undefined || !Array.isArray(data.rwOwnDecks)) {
    return (
      <List>
        <PaddedItem>Error fetching decks!</PaddedItem>
      </List>
    );
  }
  if (data.rwOwnDecks.length === 0) {
    return (
      <List>
        <PaddedItem>You have no decks</PaddedItem>
      </List>
    );
  }
  return (
    <>
      <WrOwnDecksSH subscribeToMore={subscribeToMore} />
      <WrDeckList decks={data.rwOwnDecks} />
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
