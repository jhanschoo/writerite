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
        <WrDetailHeader name="Retrieving Deck..." />
      );
    }
    if (!data || !data.rwDeck) {
      return (
        <WrDetailHeader name="Error retrieving deck" />
      );
    }
    return (
      <>
        {
          // tslint:disable-next-line: jsx-no-multiline-js
          // https://github.com/apollographql/apollo-client/issues/4246
          // @ts-ignore
          <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
        }
        <WrDetailHeader
          heading={{ m: 1, py: 3, textAlign: 'center', fontSize: '250%' }}
          name={data.rwDeck.name}
          deckId={deckId}
        />
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
