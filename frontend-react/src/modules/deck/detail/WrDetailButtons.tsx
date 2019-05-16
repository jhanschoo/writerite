import React, { Dispatch, SetStateAction, MouseEvent } from 'react';
import { WrDeckDetail } from '../types';

import { Layers, File, FileText, Plus } from 'react-feather';

import styled from 'styled-components';
import { BorderlessButton } from '../../../ui/form/Button';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

import { CurrentAddNewEnum } from './WrDeckDetail';

interface Props {
  showSubDecks: boolean;
  setShowSubDecks: Dispatch<SetStateAction<boolean>>;
  showTemplates: boolean;
  setShowTemplates: Dispatch<SetStateAction<boolean>>;
  showCards: boolean;
  setShowCards: Dispatch<SetStateAction<boolean>>;
  currentAddNew: CurrentAddNewEnum;
  setCurrentAddNew: Dispatch<SetStateAction<CurrentAddNewEnum>>;
  deck: WrDeckDetail;
}

const LeftButton = styled(BorderlessButton)`
  border-radius: 4px 0 0 4px;
  padding:
    ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[1]}
    ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[2]};
  width: 66%;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: 0;
  }
`;

const RightButton = styled(BorderlessButton)`
  border-radius: 0 4px 4px 0;
  padding:
    ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[1]};
  width: 33%;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 0;
  }
`;

const StyledList = styled(List)`
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.space[1]} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    font-size: 66%;
  }
`;

const StyledItem = styled(Item)`
  max-width: 25%;
  flex-grow: 1;
  align-items: stretch;
  margin: ${({ theme }) => theme.space[1]} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    max-width: none;
    width: 100%;
  }
`;

const WrDetailButtons = (props: Props) => {
  const {
    showSubDecks, setShowSubDecks,
    showTemplates, setShowTemplates,
    showCards, setShowCards,
    currentAddNew, setCurrentAddNew,
    deck,
  } = props;
  const toggleSubDecks = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSubDecks(!showSubDecks);
  };
  const toggleTemplates = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowTemplates(!showTemplates);
  };
  const toggleCards = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowCards(!showCards);
  };
  const toggleCurrentAddNewFactory = (v: CurrentAddNewEnum) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentAddNew === v) {
      setCurrentAddNew(CurrentAddNewEnum.NONE);
    } else {
      setCurrentAddNew(v);
    }
  };
  const templates = deck.cards.filter((card) => card.template);
  const cards = deck.cards.filter((card) => !card.template);
  return (
    <StyledList>
    <StyledItem>
      <LeftButton
        className={showSubDecks ? 'active' : undefined}
        onClick={toggleSubDecks}
      >
        0&nbsp;<Layers size={16} />Sub-Decks
      </LeftButton>
      <RightButton
        className={currentAddNew === CurrentAddNewEnum.SUBDECK ? 'active' : undefined}
        onClick={toggleCurrentAddNewFactory(CurrentAddNewEnum.SUBDECK)}
      >
        <Plus size={16} />
      </RightButton>
    </StyledItem>
    <StyledItem>
      <LeftButton
        className={showTemplates ? 'active' : undefined}
        onClick={toggleTemplates}
      >
        {templates.length}&nbsp;<File size={16} />Templates
      </LeftButton>
      <RightButton
        className={currentAddNew === CurrentAddNewEnum.TEMPLATE ? 'active' : undefined}
        onClick={toggleCurrentAddNewFactory(CurrentAddNewEnum.TEMPLATE)}
      >
        <Plus size={16} />
      </RightButton>
    </StyledItem>
      <StyledItem>
        <LeftButton
          className={showCards ? 'active' : undefined}
          onClick={toggleCards}
        >
          {cards.length}&nbsp;<FileText size={16} />Cards
        </LeftButton>
        <RightButton
          className={currentAddNew === CurrentAddNewEnum.CARD ? 'active' : undefined}
          onClick={toggleCurrentAddNewFactory(CurrentAddNewEnum.CARD)}
        >
          <Plus size={16} />
        </RightButton>
      </StyledItem>
    </StyledList>
  );
};

export default WrDetailButtons;
