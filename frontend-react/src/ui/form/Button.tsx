import styled, { ThemedStyledFunction } from 'styled-components';
import { variant } from 'styled-system';

interface VariantProps {
  variant?: string;
}

const variantStyle = variant({
  key: 'buttons',
});

const styledButton: ThemedStyledFunction<'button', any, VariantProps, never> = styled.button;

const Button = styledButton`
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

  :hover {
    cursor: pointer;
  }

  :disabled {
    color: ${({ theme }) => theme.colors.bg3};
  }

  ${variantStyle}
`;

export default Button;
