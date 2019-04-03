import styled from 'styled-components';
import { Button as rebassButton } from 'rebass';

const Button = styled(rebassButton)`
  position: relative;
  top: -1px;
  border-radius: 0;
  box-shadow: 0 1px ${(props) => props.theme.colors.shadow};
  transition: top 0.05s linear, box-shadow 0.05s linear;
  :hover {
    top: -2px;
    box-shadow: 0 2px ${(props) => props.theme.colors.shadow};
    :active {
      top: 0;
    }
  }
`;

export default Button;