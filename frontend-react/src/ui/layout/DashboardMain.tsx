import styled from 'styled-components';
import { Flex } from 'rebass';

const DashboardMain = styled(Flex)`
  display: grid;
  grid-area: 2 / 5 / 3 / 14;
  grid: min-content / repeat(3, auto);
  grid-gap: 1rem;
  align-items: start;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    grid-area: 2 / 2 / 3 / 14;
  }
`;

DashboardMain.defaultProps = {
  as: 'main',
  p: 3,
};

export default DashboardMain;
