import styled from 'styled-components';
import DashboardSidebar from '../layout/sidebar/DashboardSidebar';

const SidebarMenu = styled(DashboardSidebar)`
  font-size: 87.5%;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[2]};
`;

export default SidebarMenu;
