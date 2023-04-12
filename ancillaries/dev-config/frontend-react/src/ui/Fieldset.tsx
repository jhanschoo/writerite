import { wrStyled } from "src/theme";

// https://bugs.chromium.org/p/chromium/issues/detail?id=375693
export const Fieldset = wrStyled.div`
border: none;
margin: 0;
padding: 0;
`;

Fieldset.defaultProps = {
  // as: 'fieldset',
  role: "group",
};
