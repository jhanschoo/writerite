import React from 'react';
import WrNavBar from '../navbar/WrNavBar';
import DashboardSidebar from '../../ui/layout/DashboardSidebar';
import WrDecksList from './WrDecksList';

const DeckView = () => (
  <>
    <WrNavBar />
    <DashboardSidebar />
    <WrDecksList />
  </>
);

export default DeckView;
