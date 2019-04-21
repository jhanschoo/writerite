import styled from 'styled-components';
import DashboardSidebar from '../layout/DashboardSidebar';

const SidebarMenu = styled(DashboardSidebar)`
`;

SidebarMenu.defaultProps = Object.assign({}, DashboardSidebar.defaultProps, {
  as: 'nav',
  px: 2,
  py: 4,
  fontSize: '87.5%',
});

export default SidebarMenu;
