import { wrStyled } from "../../theme";

export const ViewportContainer = wrStyled.div`
display: grid;
z-index: 0;
height: 100vh;
min-width: 100vw;
grid: max-content minmax(1rem, 1fr) / minmax(1rem, auto) repeat(12, minmax(1rem, 96px)) minmax(1rem, auto);
place-content: start stretch;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])};
`;
