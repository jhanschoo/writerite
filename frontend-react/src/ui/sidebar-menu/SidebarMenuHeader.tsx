import styled from 'styled-components';
import { Heading } from 'rebass';

// TODO: make generic argument stricter in props that it accepts
const SidebarMenuHeader = styled(Heading)`
text-transform: uppercase;
`;

SidebarMenuHeader.defaultProps = {
  as: 'h3',
  fontSize: '100%',
  m: 0,
  px: 0,
  py: 1,
  fontWeight: 'bold',
};

export default SidebarMenuHeader;
