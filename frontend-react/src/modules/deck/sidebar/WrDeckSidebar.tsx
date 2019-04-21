import React from 'react';

import SidebarMenu from '../../../ui/sidebar-menu/SidebarMenu';
import WrManageDecks from './WrManageDecks';
import WrNewDeckItem from './WrNewDeckItem';
import WrOwnDecks from './WrOwnDecks';
import WrOthersDecks from './WrOthersDecks';

const WrDeckSidebar = (props: any) => {
  return (
    <SidebarMenu>
      <WrManageDecks />
      <WrNewDeckItem />
      <WrOwnDecks />
      <WrOthersDecks />
      {props.children}
    </SidebarMenu>
  );
};

export default WrDeckSidebar;
