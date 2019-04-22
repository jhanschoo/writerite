import styled from 'styled-components';
import DashboardSidebar from '../layout/sidebar/DashboardSidebar';

const SidebarMenu = styled(DashboardSidebar)`
  font-size: 87.5%;
  padding: ${(props) => props.theme.space[4]} ${(props) => props.theme.space[2]};
`;

SidebarMenu.defaultProps = {
  wrAs: 'nav',
};

export default SidebarMenu;
