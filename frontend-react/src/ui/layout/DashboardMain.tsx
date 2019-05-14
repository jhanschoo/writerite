import styled from 'styled-components';

const DashboardMain = styled.main`
  display: grid;
  grid-area: 2 / 5 / 3 / 14;
  grid: min-content / repeat(3, auto);
  grid-gap: 1rem;
  align-items: start;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    grid-area: 2 / 2 / 3 / 14;
  }
`;

export default DashboardMain;
