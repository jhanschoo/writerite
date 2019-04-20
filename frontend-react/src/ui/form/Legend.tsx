import styled from 'styled-components';
import { Text } from 'rebass';

// TODO: make generic argument stricter in props that it accepts
const Legend = styled(Text)`
text-transform: uppercase;
`;

Legend.defaultProps = {
  as: 'legend',
  fontSize: '75%',
  m: 0,
  p: 0,
};

export default Legend;
