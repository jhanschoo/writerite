import React from 'react';
import { Grid, Search } from 'react-feather';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const StyledItem = styled(Item)`
  margin: 1px 0;
`;

const WrManageDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Manage Decks</SidebarMenuHeader>
      <List>
        <StyledItem>
          <SidebarMenuLink to="/deck/manage">
            <Grid size={14}/>&nbsp;Organize own decks
          </SidebarMenuLink>
        </StyledItem>
        <StyledItem>
          <SidebarMenuLink to="/deck/search">
            <Search size={14}/>&nbsp;Explore public decks
          </SidebarMenuLink>
        </StyledItem>
      </List>
    </FlexSection>
  );
};

export default WrManageDecks;
