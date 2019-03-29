import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from "rebass";

const Spacer = styled(Box)`
  height: 1px;
  flex-grow: 1;
`;

Spacer.defaultProps = {
  bg: "edge"
};

const LabeledDivider = (props: any) => (
  <Flex
    alignItems="center"
  >
    <Spacer />
    <Box
      m={2}
      {...props}
    />
    <Spacer />
  </Flex>
);

export default LabeledDivider;