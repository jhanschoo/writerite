import React, { FC } from 'react';

import {
  withRouter, RouteComponentProps,
} from 'react-router';

import { WrCard } from './types';
import WrCardItem from './WrCardItem';

interface OwnProps {
  cards: WrCard[];
  promptLang: string;
  answerLang: string;
}

type Props = OwnProps & RouteComponentProps<{ deckId: string }>;

const WrCardsList: FC<Props> = (props: Props) => {
  const { cards, promptLang, answerLang } = props;
  const { deckId } = props.match.params;
  const formattedCards = cards.map((card: WrCard) => (
    <WrCardItem key={card.id} card={card} deckId={deckId} promptLang={promptLang} answerLang={answerLang} />
  ));
  return (
    <>
      {formattedCards}
    </>
  );
};

export default withRouter<Props>(WrCardsList);
