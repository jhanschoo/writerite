import styled from 'styled-components';
import { NavLink as rrLink } from 'react-router-dom';

const Link = styled(rrLink)`
display: flex;
text-decoration: none;
align-items: center;
cursor: pointer;
padding: 0;
color: inherit;
font-weight: bold;

&.active, :hover {
  ${({ theme }) => theme.bgfg[2]}
}
`;

export default Link;
