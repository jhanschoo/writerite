import styled from 'styled-components';
import { Flex } from 'rebass';

const LandingContent = styled(Flex)`
  grid-area: 2 / 2 / 3 / 14;
  overflow-y: scroll;
`;

LandingContent.defaultProps = {
  flexWrap: 'wrap',
  justifyContent: 'center',
};

export default LandingContent;
