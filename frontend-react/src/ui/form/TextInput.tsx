import styled from 'styled-components';

// TODO: make generic argument stricter in props that it accepts
export const TextInput = styled.input`
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  height: ${({ theme }) => theme.space[4]};
  padding: 0 ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.colors.lightEdge};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.fg1};

  :disabled {
    background: ${({ theme }) => theme.colors.disabled};
  }

  :hover, :focus {
    border: 1px solid ${({ theme }) => theme.colors.edge};
    outline: none;
  }

  &.error {
    border-color: ${({ theme }) => theme.colors.red};
    background: ${({ theme }) => theme.colors.washedRed};
    :active, :focus: {
      border-color: ${({ theme }) => theme.colors.red};
      background: ${({ theme }) => theme.colors.washedRed};
      box-shadow: 0 0 1px 1px ${({ theme }) => theme.colors.lightRed};
    }
  }

  &.valid {
    border-color: ${({ theme }) => theme.colors.green};
    :active, :focus: {
      border-color: ${({ theme }) => theme.colors.green};
      background: ${({ theme }) => theme.colors.lightGreen};
      box-shadow: 0 0 1px 1px ${({ theme }) => theme.colors.lightGreen};
    }
  }
`;

export const MinimalTextInput = styled.input`
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.fg1};
  height: ${({ theme }) => theme.space[4]};
  padding: 0 ${({ theme }) => theme.space[2]};
  border: none;
  background: none;

  :disabled {
    background: ${({ theme }) => theme.colors.disabled};
  }

  :focus {
    outline: none;
  }

  ::placeholder {
    font-style: italic;
  }
`;

export default TextInput;
