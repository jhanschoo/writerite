import React from 'react';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const FlexSection = styled.section`
display: flex;
flex-direction: column;
margin: ${({ theme }) => theme.space[3]} 0 ${({ theme }) => theme.space[1]} 0;
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
          <SidebarMenuLink to="/deck/own">
            Manage own decks
          </SidebarMenuLink>
        </StyledItem>
        <StyledItem>
          <SidebarMenuLink to="/deck/find">
            Explore public decks
          </SidebarMenuLink>
        </StyledItem>
      </StyledList>
    </FlexSection>
  );
};

export default WrManageDecks;
