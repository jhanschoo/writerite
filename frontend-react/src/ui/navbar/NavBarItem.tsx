import { wrStyled } from "src/theme";

export const NavBarItem = wrStyled.li`
width: auto;
padding: ${({ theme: { space } }) => space[1]};
`;
