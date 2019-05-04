import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DECK_DETAIL_QUERY, DeckDetailData, DeckDetailVariables } from '../gql';

import HDivider from '../../../ui/HDivider';
import FlexMain from '../../../ui/layout/FlexMain';
import WrTemplateCardsList from './WrTemplateCardsList';
import WrCardsList from '../../card/WrCardsList';
import WrSubdeckList from './WrSubdeckList';
import WrDetailHeader from './WrDetailHeader';
import WrDeckDetailSH from './WrDeckDetailSH';


const WrDeckDetail = (props: RouteComponentProps<{ deckId: string }>) => {
  const { match } = props;
  const { deckId } = match.params;
  const renderDeck = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<DeckDetailData, DeckDetailVariables>) => {
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
        <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
        <WrDetailHeader m={1} py={3} textAlign="center" fontSize="250%">{data.rwDeck.name}</WrDetailHeader>
        <WrSubdeckList />
        <HDivider spacer={{ my: 2 }} />
        <WrTemplateCardsList />
        <WrCardsList cards={data.rwDeck.cards} />
      </>
    );
  };
  return (
    <FlexMain>
      <Query<DeckDetailData, DeckDetailVariables>
        query={DECK_DETAIL_QUERY}
        variables={{deckId}}
        onError={printApolloError}
      >
        {renderDeck}
      </Query>
    </FlexMain>
  );
};

export default withRouter(WrDeckDetail);
