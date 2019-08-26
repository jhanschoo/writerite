import styled from 'styled-components';
import { NavLink as rrLink } from 'react-router-dom';

const Link = styled(rrLink)`
  display: flex;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.transparent};
  border-radius: 4px;
  align-items: center;
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.fg1};

  :hover {
    border-color: ${({ theme }) => theme.colors.lightEdge};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.disabled};
  }

  &.active {
    border-color: ${({ theme }) => theme.colors.lightEdge};
    background: ${({ theme }) => theme.colors.bg1};

    :hover {
      border-color: ${({ theme }) => theme.colors.edge};
    }
  }
`;

export default Link;
