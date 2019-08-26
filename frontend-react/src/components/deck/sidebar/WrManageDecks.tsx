import React from 'react';
import { Grid, Search } from 'react-feather';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const FlexSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const StyledItem = styled(Item)`
  margin: 1px 0;
`;

const StyledSidebarMenuHeader = styled(SidebarMenuHeader)`
  padding: 0 0 ${({ theme }) => theme.space[1]} 0;
`;

const StyledList = styled(List)`
  padding: 0 0 ${({ theme }) => theme.space[1]} 0;
`;

const WrManageDecks = () => {
  return (
    <FlexSection>
      <StyledSidebarMenuHeader>Manage Decks</StyledSidebarMenuHeader>
      <StyledList>
        <StyledItem>
          <SidebarMenuLink to="/deck/organize">
            <Grid size={14}/>&nbsp;Organize own decks
          </SidebarMenuLink>
        </StyledItem>
        <StyledItem>
          <SidebarMenuLink to="/deck/search">
            <Search size={14}/>&nbsp;Explore public decks
          </SidebarMenuLink>
        </StyledItem>
      </StyledList>
    </FlexSection>
  );
};

export default WrManageDecks;
