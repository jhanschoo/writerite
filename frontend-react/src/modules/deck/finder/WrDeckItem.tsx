import React from 'react';
import { Card, CardProps as rebassCardProps } from 'rebass';
import styled from 'styled-components';

interface CardProps extends rebassCardProps {
  interactive?: boolean;
  gridColumn?: string;
}

const WrDeckItem = styled<React.FC<CardProps>>(Card)`
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
