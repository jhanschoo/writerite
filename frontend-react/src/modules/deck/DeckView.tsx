import React from 'react';
import WrNavBar from '../navbar/WrNavBar';
import DashboardSidebar from '../../ui/layout/DashboardSidebar';
import WrDeckList from './WrDeckList';

const DeckView = () => (
  <>
    <WrNavBar />
    <DashboardSidebar />
    <WrDeckList />
  </>
);

export default DeckView;
