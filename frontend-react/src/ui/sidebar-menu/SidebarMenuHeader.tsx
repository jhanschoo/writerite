import { wrStyled } from "../../theme";

export const SidebarMenuHeader = wrStyled.h4`
text-transform: uppercase;
font-size: 100%;
font-weight: bold;
margin: 0;
padding: 0 0 ${({ theme: { space } }) => space[1]} 0;
`;
