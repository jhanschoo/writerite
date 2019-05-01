import styled from 'styled-components';
import { Flex } from 'rebass';

const FlexMain = styled(Flex)`
  grid-area: 2 / 5 / 3 / 14;
  align-items: stretch;

  @media (max-width: ${(props) => props.theme.breakpoints[1]}) {
    grid-area: 2 / 2 / 3 / 14;
  }
`;

FlexMain.defaultProps = {
  as: 'main',
  p: 3,
  flexDirection: 'column',
};

export default FlexMain;
