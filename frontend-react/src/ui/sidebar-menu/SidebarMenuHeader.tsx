import styled from 'styled-components';

const SidebarMenuHeader = styled.h4`
text-transform: uppercase;
font-size: 100%;
font-weight: bold;
margin: 0;
padding: 0 0 ${({ theme }) => theme.space[1]} 0;
`;

export default SidebarMenuHeader;
