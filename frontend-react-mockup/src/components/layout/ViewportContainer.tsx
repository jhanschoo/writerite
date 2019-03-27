import styled from "styled-components";
import { Box } from "rebass";

const ViewportContainer =styled(Box)`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid: 60px auto / minmax(1em, auto) repeat(12, minmax(auto, 96px)) minmax(1em, auto);
  placeContent: start stretch;
`;

ViewportContainer.defaultProps = {
  color: "fg",
  bg: "bg"
}

export default ViewportContainer;
