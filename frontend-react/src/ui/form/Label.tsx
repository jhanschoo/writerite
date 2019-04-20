import styled from 'styled-components';
import { Text } from 'rebass';

// TODO: make generic argument stricter in props that it accepts
const Label = styled(Text)``;

Label.defaultProps = {
  as: 'label',
  fontSize: '75%',
  m: 0,
  p: 0,
};

export default Label;
