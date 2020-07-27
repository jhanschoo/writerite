import { wrStyled } from "../theme";

// eslint-disable-next-line no-warning-comments
// TODO: make generic argument stricter in props that it accepts
export const TextInput = wrStyled.input`
font-size: 100%;
height: ${({ theme: { space } }) => space[4]};
padding: 0 ${({ theme: { space } }) => space[2]};
border: 1px solid ${({ theme: { bg } }) => bg[3]};
${({ theme: { fgbg, bg } }) => fgbg(bg[1])}

:hover, :focus {
  outline: none;
}

&.error {
  border-color: ${({ theme: { color } }) => color.error};
}

&.valid {
  border-color: ${({ theme: { color } }) => color.valid};
}
`;

export const MinimalTextInput = wrStyled.input`
font-weight: inherit;
font-size: inherit;
font-family: inherit;
color: inherit;
height: ${({ theme: { space } }) => space[4]};
padding: 0 ${({ theme: { space } }) => space[2]};
border: none;
background: none;

:focus {
  outline: none;
}
`;
