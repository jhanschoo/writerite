import { wrStyled } from "src/theme";

import { Sidebar } from "../layout/Sidebar";

export const SidebarMenu = wrStyled(Sidebar)`
font-size: 87.5%;
padding: 0 ${({ theme: { space } }) => space[2]};
`;
