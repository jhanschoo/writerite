import styled from 'styled-components';
import { Box } from 'rebass';

const ViewportContainer = styled(Box)`
  display: grid;
  height: 100vh;
  min-width: 100vw;
  grid: max-content minmax(1rem, 1fr) / minmax(1rem, auto) repeat(12, minmax(1rem, 96px)) minmax(1rem, auto);
  place-content: start stretch;
`;

ViewportContainer.defaultProps = {
  bg: 'bg',
};

export default ViewportContainer;
