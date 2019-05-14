import styled, { ThemedStyledFunction } from 'styled-components';
import { variant } from 'styled-system';

interface VariantProps {
  variant?: string;
}

const textInputStyle = variant({
  key: 'textInputs',
});

const styledInput: ThemedStyledFunction<'input', any, VariantProps, never> = styled.input;

// TODO: make generic argument stricter in props that it accepts
const TextInput = styledInput`
  font-weight: inherit;
  font-size: inherit;
  font-family: inherit;
  height: ${({ theme }) => theme.space[4]};
  padding: 0 ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  border-radius: 2px;
  -webkit-appearance: none;

  :disabled {
    background: ${({ theme }) => theme.colors.disabled}
  }

  :focus {
    border: 1px solid ${({ theme }) => theme.colors.edge};
    outline: none;
  }

  ${textInputStyle}
`;

export default TextInput;
