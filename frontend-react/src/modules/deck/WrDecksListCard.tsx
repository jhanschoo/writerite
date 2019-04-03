import React from 'react';
import { Flex, FlexProps } from 'rebass';
import styled, { StyledComponentProps } from 'styled-components';

const CardContainer = styled(Flex)`
  border: 1px solid ${(props) => props.theme.colors.edge};
  box-shadow: 2px 2px 0px 0px ${(props) => props.theme.colors.shadow};
  animation: fade-in-down 0.2s ease;
`;

CardContainer.defaultProps = {
  p: 3,
  alignItems: 'center',
};

export interface CardProps {
  flex?: StyledComponentProps<React.FC<FlexProps>, any, {}, never>;
}

const WrDecksListCard: React.FC<CardProps> = (props) => {
  return (
    <CardContainer
      {...props.flex}
    >
      {props.children}
    </CardContainer>
  );
};

export default WrDecksListCard;
