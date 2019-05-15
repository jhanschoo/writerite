import React from 'react';

import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

const WrOthersDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Decks Shared With You</SidebarMenuHeader>
      <List />
    </FlexSection>
  );
};

export default WrOthersDecks;
