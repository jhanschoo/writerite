import React from 'react';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

const FlexSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const WrOthersDecks = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Decks Shared With You</SidebarMenuHeader>
      <List />
    </FlexSection>
  );
};

export default WrOthersDecks;
