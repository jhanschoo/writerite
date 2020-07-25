import { wrStyled } from "../../theme";
import Sidebar from "../layout/sidebar/Sidebar";

const SidebarMenu = wrStyled(Sidebar)`
font-size: 87.5%;
padding: 0 ${({ theme: { space } }) => space[2]};
`;

export default SidebarMenu;
