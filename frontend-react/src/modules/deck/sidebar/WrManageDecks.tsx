import React from 'react';

import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';
import Icon from '../../../ui/Icon';

const WrOwnDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Manage Decks</SidebarMenuHeader>
      <List flexDirection="inherit">
        <Item>
          <SidebarMenuLink to="/deck/manage">
            <Icon icon="grid" size={16}/>&nbsp;Organize own decks
          </SidebarMenuLink>
        </Item>
        <Item>
          <SidebarMenuLink to="/deck/search">
            <Icon icon="search" size={16}/>&nbsp;Explore public decks
          </SidebarMenuLink>
        </Item>
      </List>
    </FlexSection>
  );
};

export default WrOwnDecks;
