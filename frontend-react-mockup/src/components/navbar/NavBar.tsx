import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from "rebass";

const LeftSpacer = styled(Box)`
  grid-area: 1 / 1 / 2 / 2;
  border-bottom: 1px solid ${props => props.theme.colors.edge};
`;

const RightSpacer =styled(Box)`
  grid-area: 1 / 14 / 2 / 15;
  border-bottom: 1px solid ${props => props.theme.colors.edge};
`;

const NavBarMain = styled(Flex)`
  grid-area: 1 / 2 / 2 / 14;
  border-bottom: 1px solid ${props => props.theme.colors.edge};
`

NavBarMain.defaultProps = {
  as: "nav",
  justifyContent: "space-between",
  alignItems: "center"
};

const NavBar = (props: any) => (
  <>
    <LeftSpacer {...props} />
    <NavBarMain {...props}>
      <Box>
        {props.leftItems}
      </Box>
      <Box>
        {props.centerItems}
      </Box>
      <Box>
        {props.rightItems}
      </Box>
    </NavBarMain>
    <RightSpacer {...props} />
  </>
);

export default NavBar;