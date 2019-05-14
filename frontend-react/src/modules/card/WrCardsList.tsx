import React, { useState, FC, MouseEvent } from 'react';
import {
  withRouter, RouteComponentProps,
} from 'react-router';
import { WrCard } from './types';

import { ChevronDown, ChevronUp } from 'react-feather';

import styled from 'styled-components';
import FlexCard from '../../ui/FlexCard';
import Button from '../../ui/form/Button';

import WrNewCardPrompt from './WrNewCardPrompt';
import WrCardItem from './WrCardItem';

interface OwnProps {
  cards: WrCard[];
  promptLang: string;
  answerLang: string;
}

type Props = OwnProps & RouteComponentProps<{ deckId: string }>;

const ListHeading = styled.h4`
  font-size: 125%;
  font-weight: normal;
  text-align: center;
  margin: 0;
`;

const WrCardsList: FC<Props> = (props: Props) => {
  const [show, setShow] = useState(true);
  const { cards, promptLang, answerLang } = props;
  const { deckId } = props.match.params;
  const formattedCards = cards.map((card: WrCard) => (
    <WrCardItem key={card.id} card={card} deckId={deckId} promptLang={promptLang} answerLang={answerLang} />
  ));
  const chevron = show ? <ChevronDown /> : <ChevronUp />;
  const toggleShow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShow(!show);
  };
  const content = (
    <>
      <WrNewCardPrompt deckId={deckId} />
      {formattedCards}
    </>
  );
  return (
    <>
      <FlexCard
        as="header"
        justifyContent="center"
        alignItems="center"
        p={1}
        m={1}
      >
        <ListHeading>{formattedCards.length} Cards</ListHeading>
        <Button variant="minimal" onClick={toggleShow}>{chevron}</Button>
      </FlexCard>
      {show && content}
    </>
  );
};

export default withRouter<Props>(WrCardsList);
