import styled, { StyledComponent } from 'styled-components';
import { variant } from 'styled-system';
import { Box } from 'rebass';

const textInputStyle = variant({
  key: 'textInputs',
});

// TODO: make generic argument stricter in props that it accepts
const TextInput: StyledComponent<React.FunctionComponent<any>, any> = styled(Box)`
  font-size: 100%;
  height: ${(props) => props.theme.space[4]};
  padding: 0 ${(props) => props.theme.space[2]};
  background: ${(props) => props.theme.colors.bg1};
  border: 1px solid ${(props) => props.theme.colors.edge};
  border-radius: 2px;
  -webkit-appearance: none;

  :disabled {
    background: ${(props) => props.theme.colors.disabled}
  }

  :focus {
    border: 1px solid ${(props) => props.theme.colors.edge};
    outline: none;
  }

  ${textInputStyle}
`;

TextInput.defaultProps = {
  as: 'input',
};

export default TextInput;
