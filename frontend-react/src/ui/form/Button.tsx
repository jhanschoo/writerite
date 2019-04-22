import styled from 'styled-components';
import { Button as rebassButton, ButtonProps } from 'rebass';

const Button = styled(rebassButton)`
  :hover {
    cursor: pointer;
  }

  :disabled {
    color: ${(props) => props.theme.colors.bg3};
  }
`;

Button.defaultProps = Object.assign({}, rebassButton.defaultProps as object, {
  variant: 'default',
  bg: 'transparent',
  borderRadius: 2,
  fontWeight: 'normal',
});

export default Button;
