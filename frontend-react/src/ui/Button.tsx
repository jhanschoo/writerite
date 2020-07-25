import { wrStyled } from "../theme";

export const Button = wrStyled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: 1px solid ${({ theme: { fg } }) => fg[3]};
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
cursor: pointer;

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
}
`;

export const BorderlessButton = wrStyled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
cursor: pointer;
color: inherit;

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
}
`;

export const AnchorButton = wrStyled.button`
display: inline;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: inherit;
font-size: inherit;
font-family: inherit;
outline: none;
text-decoration: underline;
color: inherit;

:hover {
  cursor: pointer;
}
`;

export const MinimalButton = wrStyled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
color: inherit;

:hover {
  cursor: pointer;
}

:disabled {
  visibility: hidden;
}
`;

export default Button;
