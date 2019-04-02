import styled from 'styled-components';
import { NavLink as rrNavLink } from 'react-router-dom';

import Link from '../Link';

const NavLink = styled(Link)`
  display: flex;

  &.active {
    background: ${(props) => props.theme.colors.activeBg};
  }
`;

NavLink.defaultProps = Object.assign({}, Link.defaultProps, {
  as: rrNavLink,
  p: 2,
});

export default NavLink;
