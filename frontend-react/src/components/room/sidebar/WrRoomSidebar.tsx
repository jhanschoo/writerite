import React from 'react';

import { WrRoomDetail } from '../../../client-models/gqlTypes/WrRoomDetail';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrInRooms from './WrInRooms';

interface Props {
  readonly room?: WrRoomDetail;
}

const WrRoomSidebar = (props: Props) => {
  const { room } = props;
  // TODO: remove this once list of rooms refactored out of sidebar
  //   into own page.
  if (!room) {
    return (
      <WrSidebarMenu>
        <WrInRooms />
      </WrSidebarMenu>
    );
  }
  return (
    <WrSidebarMenu>
      <WrInRooms />
    </WrSidebarMenu>
  );
};

export default WrRoomSidebar;
