import React, { ReactNode } from 'react';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrManageDecks from './WrManageDecks';
import WrNewDeck from './WrNewDeck';
import WrOwnDecks from './WrOwnDecks';
import WrOthersDecks from './WrOthersDecks';

interface Props {
  children?: ReactNode;
}

const WrDeckSidebar = (props: Props) => {
  return (
    <WrSidebarMenu>
      <WrManageDecks />
      <WrNewDeck />
      <WrOwnDecks />
      <WrOthersDecks />
      {props.children}
    </WrSidebarMenu>
  );
};

export default WrDeckSidebar;
