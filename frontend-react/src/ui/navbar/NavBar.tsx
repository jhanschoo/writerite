import styled from 'styled-components';

const NavBar = styled.nav`
display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
border-bottom: 1px solid ${({ theme }) => theme.edge[1]};

grid-area: 1 / 2 / 2 / 14;

@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  grid-area: 1 / 1 / 2 / 15;
}
`;

export default NavBar;
