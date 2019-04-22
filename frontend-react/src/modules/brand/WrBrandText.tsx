import React from 'react';

import styled from 'styled-components';
import { Text, TextProps } from 'rebass';

const HideableText = styled(Text)`
  @media (max-width: ${(props) => props.theme.breakpoints[1]}) {
    display: none;
  }
`;

const WrBrandText = (props: TextProps & { responsive?: boolean }) => {
  const { responsive } = props;
  return (
    <Text
      as="span"
      fontWeight="bold"
      fontFamily="brand"
      fontSize="150%"
      {...props}
    >
      W{responsive ? <HideableText as="span">riteRite</HideableText> : 'riteRite'}
    </Text>
  );
};

export default WrBrandText;
