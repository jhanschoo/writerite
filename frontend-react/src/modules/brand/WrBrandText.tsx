import React, { FC } from 'react';

import styled from 'styled-components';
import { Text, TextProps } from 'rebass';

const HideableText = styled(Text)`
  @media (max-width: ${(props) => props.theme.breakpoints[1]}) {
    display: none;
  }
`;

interface Props extends TextProps {
  responsive?: boolean;
  prefix?: string;
  suffix?: string;
}

const WrBrandText: FC<Props> = (props: Props) => {
  const { prefix, responsive, suffix } = props;
  return (
    <Text
      as="span"
      fontWeight="bold"
      fontFamily="brand"
      fontSize="150%"
      {...props}
    >
      {prefix}W{responsive ? <HideableText as="span">riteRite</HideableText> : 'riteRite'}{suffix}
    </Text>
  );
};

export default WrBrandText;
