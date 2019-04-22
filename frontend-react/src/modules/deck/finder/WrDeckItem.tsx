import React from 'react';
import styled from 'styled-components';
import { Card, CardProps } from 'rebass';

interface DeckItemProps extends CardProps {
  interactive?: boolean;
  gridColumn?: string;
}

const WrDeckItem = styled<React.FC<DeckItemProps>>(Card)`
  grid-column: ${(props) => props.gridColumn || 'auto'};
  :hover {
    cursor: ${(props) => props.interactive ? 'pointer' : 'auto'};
  }
`;

WrDeckItem.defaultProps = {
  p: 3,
  border: '1px solid',
  borderRadius: 2,
  borderColor: 'edge',
};

export default WrDeckItem;
