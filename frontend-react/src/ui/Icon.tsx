import React from 'react';

interface Props {
  icon: string;
  size?: number;
}

const Icon = (props: Props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <use xlinkHref={`feather/feather-sprite.svg#${props.icon}`} />
  </svg>
);

export default Icon;
