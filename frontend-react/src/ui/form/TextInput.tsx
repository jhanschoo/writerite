import styled, { StyledComponent } from 'styled-components';
import { variant } from 'styled-system';
import { Box } from 'rebass';

const textInputStyle = variant({
  key: 'textInputs',
});

// TODO: make generic argument stricter in props that it accepts
const TextInput: StyledComponent<React.FunctionComponent<any>, any> = styled(Box)`
  position: relative;
  top: -1px;
  box-sizing: border-box;
  font-size: 100%;
  transition: top 0.05s linear, box-shadow 0.05s linear;
  height: ${(props) => props.theme.space[4]};
  padding: 0 ${(props) => props.theme.space[2]};
  background: ${(props) => props.theme.colors.bg1};
  border: 1px solid ${(props) => props.theme.colors.edge};
  box-shadow: 0 1px 0 0 ${(props) => props.theme.colors.shadow};
  -webkit-appearance: none;

  :hover {
    top: -2px;
    box-shadow: 0 2px ${(props) => props.theme.colors.shadow};
  }

  :disabled {
    background: ${(props) => props.theme.colors.disabled}
  }

  :disabled:hover {
    top: -1px;
    box-shadow: 0 1px 0 0 ${(props) => props.theme.colors.shadow};
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
