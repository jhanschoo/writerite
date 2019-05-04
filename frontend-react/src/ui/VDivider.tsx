import React, { FC } from 'react';
import { FixRef } from '../types';

import styled from 'styled-components';
import { height, HeightProps } from 'styled-system';
import { Box, Flex, BoxProps, FlexProps } from 'rebass';

const Spacer = styled(Box)`
  width: 1px;
  flex-grow: 1;
`;

Spacer.defaultProps = {
  bg: 'edge',
};

type StyledFlexProps = FlexProps & HeightProps;

const StyledFlex = styled<FC<StyledFlexProps>>(Flex)`
  ${height}
`;

interface BaseProps extends StyledFlexProps {
  spacer?: Partial<FixRef<BoxProps>>;
  text?: Partial<FixRef<BoxProps>>;
}

type Props = Partial<FixRef<BaseProps>>;

const VDivider: FC<Props> = (props: Props) => {
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
    <StyledFlex
      flexDirection="column"
      alignItems="center"
      {...flexProps}
    >
      <Spacer {...spacer} />
      {children && labelAndHalf}
    </StyledFlex>
  );
};

export default VDivider;
