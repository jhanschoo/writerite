import { wrStyled } from "../../theme";

const NavBar = wrStyled.nav`
display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
border-bottom: 1px solid ${({ theme: { fg } }) => fg[3]};

grid-area: 1 / 2 / 2 / 14;

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  grid-area: 1 / 1 / 2 / 15;
}
`;

export default NavBar;
