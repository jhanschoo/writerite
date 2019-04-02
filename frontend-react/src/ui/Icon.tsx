import React from 'react';
import { Flex, FlexProps } from 'rebass';

interface Props extends FlexProps { icon: string; }

const Icon = (props: Props) => (
  <Flex {...props}>
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <use xlinkHref={`feather/feather-sprite.svg#${props.icon}`} />
    </svg>
  </Flex>
);

export default Icon;
