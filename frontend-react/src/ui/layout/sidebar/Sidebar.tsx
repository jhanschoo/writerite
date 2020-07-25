import { wrStyled } from "../../../theme";

const Sidebar = wrStyled.div`
grid-area: 2 / 2 / 3 / 5;
display: flex;
flex-direction: column;
overflow-y: auto;
`;

export default Sidebar;
