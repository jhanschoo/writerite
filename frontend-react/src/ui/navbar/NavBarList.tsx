import React from 'react';
import { Flex, FlexProps } from 'rebass';
import styled, { StyledComponent } from 'styled-components';

const NavBarList: StyledComponent<React.FunctionComponent<FlexProps>, any> = styled(Flex)`
  list-style: none;
  align-items: center;
`;

NavBarList.defaultProps = {
  as: 'ul',
  m: 0,
  p: 0,
  flex: '1 0 auto',
};

export default NavBarList;
