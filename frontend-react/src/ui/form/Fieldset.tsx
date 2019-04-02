import styled from 'styled-components';
import { Box } from 'rebass';

const Fieldset = styled(Box)`
  border: none;
  padding: 0;
`;

Fieldset.defaultProps = {
  as: 'fieldset',
};

export default Fieldset;
