import styled from 'styled-components';
import { Text } from 'rebass';

const SmallMessage = styled(Text)`
  animation: grow-vertically 0.25s linear 0s;
`;

SmallMessage.defaultProps = {
  fontSize: "75%"
};

export default SmallMessage;