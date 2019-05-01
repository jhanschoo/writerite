import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DECK_QUERY, DeckData, DeckVariables } from '../gql';

import { Text } from 'rebass';
import HDivider from '../../../ui/HDivider';
import FlexMain from '../../../ui/layout/FlexMain';
import WrTemplateCardsList from './WrTemplateCardsList';
import WrCardsList from './WrCardsList';
import WrSubdeckList from './WrSubdeckList';
import WrDetailHeader from './WrDetailHeader';

const renderDeck = ({
  subscribeToMore, loading, error, data,
}: QueryResult<DeckData, DeckVariables>) => {
  if (error) {
    return null;
  }
  if (loading) {
    return (
      <WrDetailHeader><em>Retrieving Deck...</em></WrDetailHeader>
    );
  }
  if (!data || !data.rwDeck) {
    return (
      <WrDetailHeader><em>Error retrieving deck</em></WrDetailHeader>
    );
  }
  return (
    <>
      {/* <WrOwnDecksSH subscribeToMore={subscribeToMore} /> */}
      <WrDetailHeader m={1} py={3} textAlign="center" fontSize="250%">{data.rwDeck.name}</WrDetailHeader>
      <WrSubdeckList />
      <HDivider spacer={{ my: 2 }} />
      <WrTemplateCardsList />
      <WrCardsList />
    </>
  );
};

const WrDeckDetail = (props: RouteComponentProps<{ deckId: string }>) => {
  const { match } = props;
  const { deckId } = match.params;
  return (
    <FlexMain>
      <Query<DeckData, DeckVariables>
        query={DECK_QUERY}
        variables={{deckId}}
        onError={printApolloError}
      >
        {renderDeck}
      </Query>
    </FlexMain>
  );
};

export default withRouter(WrDeckDetail);
