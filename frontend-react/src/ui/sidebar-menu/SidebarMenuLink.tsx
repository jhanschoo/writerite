import { wrStyled } from "../../theme";
import Link from "../Link";

const SidebarMenuLink = wrStyled(Link)`
width: 100%;
padding: ${({ theme: { space } }) => space[1]};
font-weight: normal;
`;

export default SidebarMenuLink;
