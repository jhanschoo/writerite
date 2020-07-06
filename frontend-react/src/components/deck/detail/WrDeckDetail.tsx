import React from 'react';

import { useParams } from 'react-router';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK_DETAIL } from '../../../client-models';
import { WrCard } from '../../../client-models/gqlTypes/WrCard';
import { DeckDetail, DeckDetailVariables  } from './gqlTypes/DeckDetail';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import WrCardsList from '../../card/WrCardsList';
import WrNewCardPrompt from '../../card/WrNewCardPrompt';
import HDivider from '../../../ui-components/HDivider';

import WrDeckDetailHeader from './WrDeckDetailHeader';
import WrNewSubdeck from './WrNewSubdeck';
import WrSubdecksList from './WrSubdecksList';

const DECK_DETAIL_QUERY = gql`
${WR_DECK_DETAIL}
query DeckDetail($deckId: ID!) {
  deck(id: $deckId) {
    ...WrDeckDetail
  }
}
`;

const CenteredP = styled.p`
text-align: center;
`;

const WrDeckDetailComponent = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const {
    loading, error, data,
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
  if (!data?.deck) {
    return (
      <CenteredP>
        Error retrieving deck. Please try again later.
      </CenteredP>
    );
  }
  const { deck } = data;
  const { promptLang, answerLang } = deck;
  const templates = deck.cards?.filter<WrCard>((card): card is WrCard => card?.template === true);
  const cards = deck.cards?.filter<WrCard>((card): card is WrCard => card?.template === false);
  return (
    <Main>
      <WrDeckDetailHeader deck={deck} />
      <HDivider>{deck.children?.length || 0} Sub-Decks</HDivider>
      <WrNewSubdeck deck={deck} />
      <WrSubdecksList deck={deck} />
      <HDivider>{templates?.length || 0} Template Cards</HDivider>
      {templates && <WrCardsList cards={templates} promptLang={promptLang} answerLang={answerLang} />}
      <HDivider>{cards?.length || 0} Cards</HDivider>
      <WrNewCardPrompt deckId={deckId} />
      {cards && <WrCardsList cards={cards} promptLang={promptLang} answerLang={answerLang} />}
    </Main>
  );
};

export default WrDeckDetailComponent;
