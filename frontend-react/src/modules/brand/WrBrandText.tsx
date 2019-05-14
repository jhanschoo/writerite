import React, { FC } from 'react';

import styled from 'styled-components';

const BrandText = styled.span`
  font-weight: bold;
  font-size: 150%;
  font-family: "Josefin Slab", serif;
`;

interface Props {
  short?: boolean;
  prefix?: string;
  suffix?: string;
}

const WrBrandText: FC<Props> = (props: Props) => {
  const { prefix, short, suffix } = props;
  return (
    <BrandText>
      {prefix}{short ? 'W' : 'WriteRite'}{suffix}
    </BrandText>
  );
};

export default WrBrandText;
