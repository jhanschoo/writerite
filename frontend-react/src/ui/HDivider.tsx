import React, { ReactChild } from 'react';
import { FixRef } from '../types';

import styled from 'styled-components';
import { Box, Flex, BoxProps, FlexProps } from 'rebass';

const Spacer = styled(Box)`
  height: 1px;
  flex-grow: 1;
`;

Spacer.defaultProps = {
  bg: 'edge',
};

interface Props extends FlexProps {
  spacer?: FixRef<BoxProps>;
  text?: FixRef<BoxProps>;
}

const HDivider: React.FunctionComponent<Props> = (props: Props) => {
  const { text, spacer, children, ...flexProps } = props;
  const labelAndHalf = (
    <>
      <Box
        m={2}
        {...text}
      >
      {children}
      </Box>
      <Spacer {...spacer} />
    </>
  );
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      {...flexProps}
    >
      <Spacer {...props.spacer} />
      {children && labelAndHalf}
    </Flex>
  );
};

export default HDivider;
