import React from 'react';

import {
  withRouter, RouteComponentProps,
} from 'react-router';

import { WrCard } from '../../client-models/gqlTypes/WrCard';

import WrCardItem from './WrCardItem';

interface OwnProps {
  cards: (WrCard | null)[];
  promptLang: string;
  answerLang: string;
}

type Props = OwnProps & RouteComponentProps<{ deckId: string }>;

const WrCardsList = ({ cards, promptLang, answerLang, match: { params: { deckId } } }: Props) => {
  const formattedCards = cards.map((card) => card &&
    <WrCardItem key={card.id} card={card} deckId={deckId} promptLang={promptLang} answerLang={answerLang} />
  );
  return (
    <>
      {formattedCards}
    </>
  );
};

export default withRouter(WrCardsList);
