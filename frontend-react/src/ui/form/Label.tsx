import styled from 'styled-components';
import { Text } from 'rebass';

// TODO: make generic argument stricter in props that it accepts
const Label = styled(Text)``;

Label.defaultProps = {
  as: 'label',
  fontSize: '75%',
};

export default Label;
