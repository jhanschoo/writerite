import { wrStyled } from "../../theme";

const NavBarItem = wrStyled.li`
width: auto;
padding: ${({ theme: { space } }) => space[1]};
`;

export default NavBarItem;
