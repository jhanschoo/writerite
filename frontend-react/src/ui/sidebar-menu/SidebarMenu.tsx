import styled from 'styled-components';
import Sidebar from '../layout/sidebar/Sidebar';

const SidebarMenu = styled(Sidebar)`
font-size: 87.5%;
padding: 0 ${({ theme }) => theme.space[2]};
`;

export default SidebarMenu;
