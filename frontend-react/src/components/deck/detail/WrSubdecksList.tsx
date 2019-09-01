import React from 'react';

import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';

import styled from 'styled-components';
import List from '../../../ui/list/List';

import WrSubdeckItem from './WrSubdeckItem';

const StyledList = styled(List)`
flex-direction: row;
flex-wrap: wrap;
`;

interface Props {
  deck: WrDeckDetail;
}

const WrSubdecksList = ({ deck }: Props) => {
  const styledDecks = deck.subdecks.map((subdeck) => (
    <WrSubdeckItem key={subdeck.id} deck={deck} subdeck={subdeck} />
  ));
  return (
    <StyledList>
      {styledDecks}
    </StyledList>
  );
};

export default WrSubdecksList;