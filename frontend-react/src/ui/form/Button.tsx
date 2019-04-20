import styled from 'styled-components';
import { Button as rebassButton } from 'rebass';

const Button = styled(rebassButton)`
  transition: background-color 0.05s linear, box-shadow 0.05s linear;
  :hover {
    cursor: pointer;
  }
`;

Button.defaultProps = {
  as: 'button',
  fontSize: 'inherit',
  m: 0,
  px: 3,
  py: 2,
  color: 'fg',
  border: 0,
  bg: 'transparent',
  borderRadius: 2,
  fontWeight: 'normal',
};

export default Button;
