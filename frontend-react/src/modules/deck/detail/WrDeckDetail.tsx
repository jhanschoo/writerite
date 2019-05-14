import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DECK_DETAIL_QUERY, DeckDetailData, DeckDetailVariables } from '../gql';

import styled from 'styled-components';
import HDivider from '../../../ui/HDivider';
import FlexMain from '../../../ui/layout/FlexMain';
import WrTemplateCardsList from './WrTemplateCardsList';
import WrCardsList from '../../card/WrCardsList';
import WrSubdeckList from './WrSubdeckList';
import WrDetailHeader from './WrDetailHeader';
import WrDeckDetailSH from './WrDeckDetailSH';

const CenteredP = styled.p`
  text-align: center;
`;

// TODO: refactor accordion sections w/ header into a row of toggle
// switches for displaying those sections
// attached to a + <num> for adding one item of the respective kind
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
        <CenteredP>
          Retrieving deck...
        </CenteredP>
      );
    }
    if (!data || !data.rwDeck) {
      return (
        <CenteredP>
          Error retrieving deck. Please try again later.
        </CenteredP>
      );
    }
    const { name, cards, promptLang, answerLang } = data.rwDeck;
    return (
      <>
        {
          // tslint:disable-next-line: jsx-no-multiline-js
          // https://github.com/apollographql/apollo-client/issues/4246
          // @ts-ignore
          <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
        }
        <WrDetailHeader deck={data.rwDeck} />
        <HDivider />
        <WrSubdeckList />
        <WrTemplateCardsList />
        <WrCardsList cards={cards} promptLang={promptLang} answerLang={answerLang} />
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
