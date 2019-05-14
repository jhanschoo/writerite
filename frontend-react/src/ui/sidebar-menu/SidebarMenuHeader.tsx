import styled from 'styled-components';

const SidebarMenuHeader = styled.h4`
  text-transform: uppercase;
  font-size: 100%;
  font-weight: bold;
  margin: 0;
  padding: ${(props) => props.theme.space[1]} ${(props) => props.theme.space[0]};
`;

export default SidebarMenuHeader;
