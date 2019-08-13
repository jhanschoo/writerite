import React from 'react';

import { IWrRoomDetail } from '../../../client-models/WrRoomDetail';

import WrSidebarMenu from '../../sidebar-menu/WrSidebarMenu';
import WrInRooms from './WrInRooms';

interface Props {
  readonly room?: IWrRoomDetail;
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
