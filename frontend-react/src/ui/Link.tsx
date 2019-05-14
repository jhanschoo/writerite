import styled from 'styled-components';
import { NavLink as rrLink } from 'react-router-dom';

const Link = styled(rrLink)`
  display: flex;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.transparent};
  border-radius: 2px;
  align-items: center;
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.fg1};

  &.active {
    border-color: ${({ theme }) => theme.colors.edge};
  }

  :hover {
    background: ${({ theme }) => theme.colors.bg2};
  }
`;

export default Link;
