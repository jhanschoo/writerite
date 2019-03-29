import styled, { StyledComponent } from 'styled-components';
import { variant } from 'styled-system';
import { Box } from 'rebass';

const textInputStyle = variant({
  key: 'textInputs'
});

// TODO: make generic argument stricter in props that it accepts
const TextInput: StyledComponent<React.FunctionComponent<any>, any> = styled(Box)`
  box-sizing: border-box;
  font-size: 100%;
  height: ${props => props.theme.space[4]};
  border: 1px solid ${props => props.theme.colors.edge};
  border-radius: 4px;
  padding: 0 ${props => props.theme.space[2]};
  background: ${props => props.theme.colors.bg1};
  -webkit-appearance: none;

  :disabled {
    background: ${props => props.theme.colors.bg2}
  }

  :active, :focus {
    background: ${props => props.theme.colors.activeBg};
    border-color: ${props => props.theme.colors.activeEdge};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.activeShadow};
  }

  :focus {
    outline: none;
  }

  ${textInputStyle}
`;

TextInput.defaultProps = {
  as: "input"
};

export default TextInput;