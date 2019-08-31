import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK_DETAIL } from '../../../client-models';
import { DeckDetail, DeckDetailVariables } from './gqlTypes/DeckDetail';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import WrCardsList from '../../card/WrCardsList';
import WrNewCardPrompt from '../../card/WrNewCardPrompt';
import HDivider from '../../../ui-components/HDivider';

import WrDeckDetailSH from './WrDeckDetailSH';
import WrDeckDetailHeader from './WrDeckDetailHeader';
import WrNewSubdeck from './WrNewSubdeck';

const DECK_DETAIL_QUERY = gql`
${WR_DECK_DETAIL}
query DeckDetail($deckId: ID!) {
  rwDeck(id: $deckId) {
    ...WrDeckDetail
  }
}
`;

const CenteredP = styled.p`
text-align: center;
`;

const WrDeckDetailComponent = ({ match: { params: { deckId } } }: RouteComponentProps<{ deckId: string }>) => {
  const {
    loading, error, data, subscribeToMore,
  } = useQuery<DeckDetail, DeckDetailVariables>(DECK_DETAIL_QUERY, {
    variables: { deckId },
    onError: printApolloError,
  });
  if (error) {
    return (<Main/>);
  }
  if (loading) {
    return (
      <Main>
        <CenteredP>
          Retrieving deck...
        </CenteredP>
      </Main>
    );
  }
  if (!data || !data.rwDeck) {
    return (
      <CenteredP>
        Error retrieving deck. Please try again later.
      </CenteredP>
    );
  }
  const deck = data.rwDeck;
  const { promptLang, answerLang } = deck;
  const templates = data.rwDeck.cards.filter((card) => card.template);
  const cards = data.rwDeck.cards.filter((card) => !card.template);
  return (
    <Main>
      <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
      <WrDeckDetailHeader deck={deck} />
      <HDivider>{templates.length} Sub-Decks</HDivider>
      <WrNewSubdeck />
      <HDivider>{templates.length} Template Cards</HDivider>
      <WrCardsList cards={templates} promptLang={promptLang} answerLang={answerLang} />
      <HDivider>{cards.length} Cards</HDivider>
      <WrNewCardPrompt deckId={deckId} />
      <WrCardsList cards={cards} promptLang={promptLang} answerLang={answerLang} />
    </Main>
  );
};

export default withRouter(WrDeckDetailComponent);
