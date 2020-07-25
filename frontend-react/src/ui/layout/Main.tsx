import { wrStyled } from "../../theme";

const Main = wrStyled.main`
grid-area: 2 / 2 / 3 / 14;
align-items: stretch;
overflow-y: auto;

padding: 0 ${({ theme: { space } }) => space[3]};
display: flex;
flex-direction: column;
`;

export default Main;
