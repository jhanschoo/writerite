import React from 'react';
import styled, { StyledComponent } from "styled-components";

import Link from "../Link";

const NavLink = styled(Link)`
  display: flex;
`;

NavLink.defaultProps = Object.assign({}, Link.defaultProps, {
  p: 2
});

export default NavLink;