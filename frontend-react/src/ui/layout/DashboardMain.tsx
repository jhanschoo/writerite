import styled from 'styled-components';
import { Flex } from "rebass";

const DashboardMain = styled(Flex)`
  display: grid;
  grid-area: 2 / 5 / 3 / 14;
  grid: min-content / repeat(3, auto);
  grid-gap: 1em;
  align-items: start;
`;

DashboardMain.defaultProps = {
  p: 3
};

export default DashboardMain;