import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { Link as rrLink } from 'react-router-dom';
import { Text } from 'rebass';

const Link: StyledComponent<React.FunctionComponent<any>, any> = styled(Text)`
  text-decoration: none;

  :hover {
    background: ${(props) => props.theme.colors.bg2};
  }
`;

Link.defaultProps = {
  as: rrLink,
  color: 'fg1',
};

export default Link;
