import React from 'react';
import { Box, Heading } from "rebass";
import styled from 'styled-components';

const CardContainer = styled(Box)`
  border: 1px solid ${props => props.theme.colors.edge};
  box-shadow: 2px 2px 0px 0px ${props => props.theme.colors.shadow};
`;

CardContainer.defaultProps = {
  p: 3
};

const WrDecksListCard = (props: any) => {
  const { debugState } = props;
  return (
    <CardContainer
      {...props.box}
    >
      <Heading as="h4" fontSize="120%">{props.title}</Heading>
      {props.children}

    </CardContainer>
  )
};

export default WrDecksListCard;