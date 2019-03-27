import styled from 'styled-components';
import { Flex } from "rebass";

const LandingContent = styled(Flex)`
  grid-area: 2 / 2 / 3 / 14
`;

LandingContent.defaultProps = {
  flexWrap: "wrap"
}

export default LandingContent;