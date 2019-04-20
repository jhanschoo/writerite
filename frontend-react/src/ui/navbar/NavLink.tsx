import styled from 'styled-components';
import { NavLink as rrNavLink } from 'react-router-dom';

import Link from '../Link';

const NavLink = styled(Link)`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.bg1};
  border-radius: 2px;

  &.active {
    border: 1px solid ${(props) => props.theme.colors.edge};
  }
`;

NavLink.defaultProps = Object.assign({}, Link.defaultProps, {
  as: rrNavLink,
  p: 2,
});

export default NavLink;
