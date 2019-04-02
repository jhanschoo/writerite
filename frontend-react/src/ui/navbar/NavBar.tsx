import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { Box, Flex, BoxProps, FlexProps } from 'rebass';

const LeftSpacer: StyledComponent<React.FunctionComponent<BoxProps>, any> = styled(Box)`
  grid-area: 1 / 1 / 2 / 2;
  border-bottom: 1px solid ${(props) => props.theme.colors.edge};
`;

const RightSpacer: StyledComponent<React.FunctionComponent<BoxProps>, any> = styled(Box)`
  grid-area: 1 / 14 / 2 / 15;
  border-bottom: 1px solid ${(props) => props.theme.colors.edge};
`;

const NavBarMain: StyledComponent<React.FunctionComponent<FlexProps>, any> = styled(Flex)`
  grid-area: 1 / 2 / 2 / 14;
  border-bottom: 1px solid ${(props) => props.theme.colors.edge};
`;

NavBarMain.defaultProps = {
  as: 'nav',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const NavBar: React.FunctionComponent<any> = (props: any) => (
  <>
    <LeftSpacer />
    <NavBarMain {...props} />
    <RightSpacer />
  </>
);

export default NavBar;
