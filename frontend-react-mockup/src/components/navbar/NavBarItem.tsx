import styled from 'styled-components';
import { Flex } from "rebass";

const NavBarItem = styled(Flex)``;

NavBarItem.defaultProps = {
  as: "li",
  width: "auto",
  py: 1
};

export default NavBarItem;