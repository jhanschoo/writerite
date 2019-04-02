import styled, { StyledComponent } from 'styled-components';
import { variant, ResponsiveValue } from 'styled-system';
import { Box, BoxProps } from 'rebass';

const textInputStyle = variant({
  key: 'textInputs',
});

interface Props extends BoxProps {
  variant?: ResponsiveValue<string>;
}

// TODO: make generic argument stricter in props that it accepts
const TextInput: StyledComponent<React.FunctionComponent<Props>, any> = styled(Box)`
  position: relative;
  top: -1px;
  box-sizing: border-box;
  font-size: 100%;
  transition: top 0.05s linear, box-shadow 0.05s linear;
  height: ${(props) => props.theme.space[4]};
  border: 1px solid ${(props) => props.theme.colors.edge};
  box-shadow: 2px 3px 0 0 ${(props) => props.theme.colors.shadow};
  padding: 0 ${(props) => props.theme.space[2]};
  background: ${(props) => props.theme.colors.bg1};
  -webkit-appearance: none;

  :hover {
    top: -2px;
    box-shadow: 3px 4px ${(props) => props.theme.colors.shadow};
  }

  :disabled {
    background: ${(props) => props.theme.colors.bg2}
  }

  :active, :focus {
    border: 1px solid ${(props) => props.theme.colors.activeEdge};
  }

  :focus {
    outline: none;
  }

  ${textInputStyle}
`;

TextInput.defaultProps = {
  as: 'input',
};

export default TextInput;
