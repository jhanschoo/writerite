import styled from 'styled-components';

const SidebarMenuHeader = styled.h4`
  text-transform: uppercase;
  font-size: 100%;
  font-weight: bold;
  margin: 0;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
`;

export default SidebarMenuHeader;
