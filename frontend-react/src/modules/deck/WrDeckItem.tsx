import React from 'react';
import { Card, CardProps as rebassCardProps } from 'rebass';
import styled from 'styled-components';
import { border } from 'styled-system';

interface CardProps extends rebassCardProps {
  interactive?: boolean;
  gridColumn?: string;
}

const WrDecksListItem = styled<React.FC<CardProps>>(Card)`
  grid-column: ${(props) => props.gridColumn || 'auto'};
  animation: fade-in-down 0.2s ease;
  :hover {
    cursor: ${(props) => props.interactive ? 'pointer' : 'auto'};
  }
`;

WrDecksListItem.defaultProps = {
  p: 3,
  border: '1px solid',
  borderRadius: 2,
  borderColor: 'edge',
};

export default WrDecksListItem;
