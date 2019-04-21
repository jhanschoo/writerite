import styled from 'styled-components';
import { Button as rebassButton, ButtonProps } from 'rebass';

const Button = styled(rebassButton)`
  :hover {
    cursor: pointer;
  }
`;

Button.defaultProps = Object.assign({}, rebassButton.defaultProps as object, {
  color: 'fg',
  bg: 'transparent',
  borderRadius: 2,
  fontWeight: 'normal',
});

export default Button;
