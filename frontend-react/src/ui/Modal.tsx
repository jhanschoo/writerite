import { wrStyled } from "../theme";
import { BorderlessButton } from "./Button";

export const ModalBackground = wrStyled.div`
position: fixed;
height: 100vh;
width: 100vw;
top: 0;
left: 0;
z-index: 100;
background: ${({ theme: { color } }) => color.darken};
display: grid;
justify-content: center;
align-content: center;
`;

export const ModalContainer = wrStyled.div`
position: relative;
${({ theme: { fgbg, bg } }) => fgbg(bg[0])}
`;

export const ModalCloseButton = wrStyled(BorderlessButton)`
position: absolute;
left: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `${space[1]} ${space[3]}`};
bottom: 100%;
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[0])}
}
`;
