import styled from 'styled-components';
import { Flex } from 'rebass';

const DashboardSidebar = styled(Flex)`
  grid-area: 2 / 2 / 3 / 5;
`;

DashboardSidebar.defaultProps = {
  flexDirection: 'column',
};

export default DashboardSidebar;
