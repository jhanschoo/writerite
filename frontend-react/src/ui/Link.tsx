import { wrStyled } from "src/theme";
import { NavLink as rrLink } from "react-router-dom";

export const Link = wrStyled(rrLink)`
display: flex;
text-decoration: none;
align-items: center;
cursor: pointer;
padding: 0;
color: inherit;
font-weight: bold;

&.active, :hover {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
}
`;

export const MinimalLink = wrStyled(rrLink)`
display: flex;
text-decoration: none;
align-items: stretch;
cursor: pointer;
padding: 0;
color: inherit;
font-weight: bold;
`;
