import styled from 'styled-components';
import { Box } from 'rebass';

const Fieldset = styled(Box)`
  border: none;
`;

Fieldset.defaultProps = {
  as: 'fieldset',
  m: 0,
  p: 0,
};

export default Fieldset;
