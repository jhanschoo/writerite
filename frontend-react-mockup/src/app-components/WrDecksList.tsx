import React from 'react';
import DashboardMain from '../components/layout/DashboardMain';
import WrDecksListCard from './WrDecksListCard';

const WrDecksList = (props: any) => (
  <DashboardMain>
    <WrDecksListCard title="Hello" />
    <WrDecksListCard title="Hello" />
    <WrDecksListCard title="Hello" />
    <WrDecksListCard title="Hello" />
    <WrDecksListCard title="Hello" />
    <WrDecksListCard title="Hello" />
  </DashboardMain>
);

export default WrDecksList;