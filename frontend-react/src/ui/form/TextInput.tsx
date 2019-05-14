import styled, { StyledComponent } from 'styled-components';
import { variant } from 'styled-system';
import { Box } from 'rebass';

const textInputStyle = variant({
  key: 'textInputs',
});

// TODO: make generic argument stricter in props that it accepts
const TextInput: StyledComponent<React.FunctionComponent<any>, any> = styled(Box)`
  font-size: 100%;
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

TextInput.defaultProps = {
  as: 'input',
};

export default TextInput;
