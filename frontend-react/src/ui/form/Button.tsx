import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.edge};
  border-radius: 4px;
  margin: 0;
  padding: 0;
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  color: ${({ theme }) => theme.colors.fg1};

  :hover {
    background: ${({ theme }) => theme.colors.bg2};
    cursor: pointer;
  }

  :disabled {
    border-color: ${({ theme }) => theme.colors.disabled};
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

export const BorderlessButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.transparent};
  border-radius: 4px;
  margin: 0;
  padding: 0;
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  color: ${({ theme }) => theme.colors.fg1};

  :hover {
    cursor: pointer;
    border-color: ${({ theme }) => theme.colors.bg2};
    background: ${({ theme }) => theme.colors.bg2};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.disabled};
  }

  &.active {
    border-color: ${({ theme }) => theme.colors.edge};

    :hover {
      border-color: ${({ theme }) => theme.colors.edge};
    }
  }
`;

export const AnchorButton = styled.button`
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
  color: ${({ theme }) => theme.colors.fg1};

  :hover {
    cursor: pointer;
  }

  :disabled {
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

export const AuxillaryButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  color: ${({ theme }) => theme.colors.fg2};

  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.fg1};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

export const MinimalButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  color: ${({ theme }) => theme.colors.fg1};

  :hover {
    cursor: pointer;
  }

  :disabled {
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

export default Button;
