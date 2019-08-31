import React, { ReactNode } from 'react';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrManageDecks from './WrManageDecks';
import WrNewDeck from './WrNewDeck';
import WrOwnDecks from './WrOwnDecks';

interface Props {
  children?: ReactNode;
}

const WrDeckSidebar = ({ children }: Props) => {
  return (
    <WrSidebarMenu>
      <WrManageDecks />
      <WrNewDeck />
      <WrOwnDecks />
      {children}
    </WrSidebarMenu>
  );
};

export default WrDeckSidebar;
