import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { Flex, FlexProps } from 'rebass';

const NavBarItem: StyledComponent<React.FunctionComponent<FlexProps>, any> = styled(Flex)``;

NavBarItem.defaultProps = {
  as: 'li',
  width: 'auto',
  py: 1,
};

export default NavBarItem;
