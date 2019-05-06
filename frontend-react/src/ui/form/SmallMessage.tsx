import styled from 'styled-components';
import { Text } from 'rebass';

const SmallMessage = styled(Text)`
  display: flex;
`;

SmallMessage.defaultProps = {
  fontSize: '75%',
};

export default SmallMessage;
