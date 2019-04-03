import React from 'react';
import { Heading, Flex } from 'rebass';
import DashboardMain from '../../ui/layout/DashboardMain';
import WrDecksListCard from './WrDecksListCard';
import Icon from '../../ui/Icon';

const WrDecksList = () => {
  return (
    <DashboardMain>
      <WrDecksListCard>
        <Flex p={1}><Icon icon="plus-circle" size={32} /></Flex><Heading as="h4" fontSize="120%">New Deck</Heading>
      </WrDecksListCard>
    </DashboardMain>
  );
};

export default WrDecksList;
