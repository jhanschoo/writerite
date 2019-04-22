import React from 'react';
import { Grid, Search } from 'react-feather';

import { gridAutoRows } from 'styled-system';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const WrManageDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Manage Decks</SidebarMenuHeader>
      <List flexDirection="inherit">
        <Item>
          <SidebarMenuLink to="/deck/manage">
            <Grid size={16}/>&nbsp;Organize own decks
          </SidebarMenuLink>
        </Item>
        <Item>
          <SidebarMenuLink to="/deck/search">
            <Search size={16}/>&nbsp;Explore public decks
          </SidebarMenuLink>
        </Item>
      </List>
    </FlexSection>
  );
};

export default WrManageDecks;
