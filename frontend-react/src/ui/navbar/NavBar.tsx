import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { Flex, FlexProps } from 'rebass';

const NavBar: StyledComponent<React.FunctionComponent<FlexProps>, any> = styled(Flex)`
  grid-area: 1 / 2 / 2 / 14;
  border-bottom: 1px solid ${(props) => props.theme.colors.edge};

  @media (max-width: ${(props) => props.theme.breakpoints[1]}) {
    grid-area: 1 / 1 / 2 / 15;
  }
`;

NavBar.defaultProps = {
  as: 'nav',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export default NavBar;
