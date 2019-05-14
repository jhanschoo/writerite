import React from 'react';

import styled, { ThemedStyledFunction } from 'styled-components';

interface DeckItemProps {
  interactive?: boolean;
  gridColumn?: string;
}

const styledDiv: ThemedStyledFunction<'div', any, DeckItemProps, never> = styled.div;

const WrDeckItem = styledDiv`
  grid-column: ${({ gridColumn }) => gridColumn || 'auto'};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  border-radius: 2px;
  :hover {
    cursor: ${({ interactive }) => interactive ? 'pointer' : 'auto'};
  }
`;

export default WrDeckItem;
