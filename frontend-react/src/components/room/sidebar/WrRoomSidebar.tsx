import React from 'react';

import { WrRoomDetail } from '../../../client-models/gqlTypes/WrRoomDetail';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrOccupiedRooms from './WrOccupiedRooms';

interface Props {
  readonly room?: WrRoomDetail;
}

const WrRoomSidebar = ({ room }: Props) => {
  // TODO: remove this once list of rooms refactored out of sidebar
  //   into own page.
  if (!room) {
    return (
      <WrSidebarMenu>
        <WrOccupiedRooms />
      </WrSidebarMenu>
    );
  }
  return (
    <WrSidebarMenu>
      <WrOccupiedRooms />
    </WrSidebarMenu>
  );
};

export default WrRoomSidebar;
