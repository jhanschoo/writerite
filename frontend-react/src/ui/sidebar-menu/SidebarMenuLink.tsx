import styled from 'styled-components';
import Link from '../Link';

const SidebarMenuLink = styled(Link)``;

SidebarMenuLink.defaultProps = Object.assign({}, Link.defaultProps, {
  width: '100%',
  p: 1,
});

export default SidebarMenuLink;
