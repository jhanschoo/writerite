import styled from "styled-components";
import { Box } from "rebass";

const ViewportContainer =styled(Box)`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid: min-content auto / minmax(1em, auto) repeat(12, minmax(auto, 96px)) minmax(1em, auto);
  placeContent: start stretch;
`;

ViewportContainer.defaultProps = {
  bg: "bg"
}

export default ViewportContainer;