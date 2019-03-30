import { Flex } from "rebass";
import styled from "styled-components";

const NavBarList = styled(Flex)`
  list-style: none;
`;

NavBarList.defaultProps = {
  as: "ul",
  m: 0,
  p: 0,
  flex: "1 0 auto"
};

export default NavBarList;