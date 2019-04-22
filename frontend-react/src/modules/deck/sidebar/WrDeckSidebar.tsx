import React, { ReactType } from 'react';

import SidebarMenu from '../../../ui/sidebar-menu/SidebarMenu';

import WrManageDecks from './WrManageDecks';
import WrNewDeck from './WrNewDeck';
import WrOwnDecks from './WrOwnDecks';
import WrOthersDecks from './WrOthersDecks';

const WrDeckSidebar = (props: { children?: ReactType }) => {
  return (
    <SidebarMenu>
      <WrManageDecks />
      <WrNewDeck />
      <WrOwnDecks />
      <WrOthersDecks />
      {props.children}
    </SidebarMenu>
  );
};

export default WrDeckSidebar;
