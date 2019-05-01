import styled from 'styled-components';
import { Box } from 'rebass';

const Fieldset = styled(Box)`
  border: none;
`;

Fieldset.defaultProps = {
  // https://bugs.chromium.org/p/chromium/issues/detail?id=375693
  // as: 'fieldset',
  role: 'group',
  m: 0,
  p: 0,
};

export default Fieldset;
