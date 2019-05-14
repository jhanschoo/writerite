import styled from 'styled-components';
import Link from '../Link';

const SidebarMenuLink = styled(Link)`
  width: 100%;
  padding: ${({ theme }) => theme.space[1]};
`;

export default SidebarMenuLink;
