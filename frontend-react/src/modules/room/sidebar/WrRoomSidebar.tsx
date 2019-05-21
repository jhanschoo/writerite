import React from 'react';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrInRooms from './WrInRooms';

const WrRoomSidebar = (props: {}) => {
  return (
    <WrSidebarMenu>
      <WrInRooms />
    </WrSidebarMenu>
  );
};

export default WrRoomSidebar;
