import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { NavLink as rrLink } from 'react-router-dom';
import { Flex } from 'rebass';

const Link: StyledComponent<React.FunctionComponent<any>, any> = styled(Flex)`
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.transparent};
  border-radius: 2px;
  align-items: center;
  cursor: pointer;

  &.active {
    border-color: ${({ theme }) => theme.colors.edge};
  }

  :hover {
    background: ${({ theme }) => theme.colors.bg2};
  }
`;

Link.defaultProps = {
  as: rrLink,
  p: 2,
  color: 'fg1',
};

export default Link;
