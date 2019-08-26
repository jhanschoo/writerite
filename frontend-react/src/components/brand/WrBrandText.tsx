import React, { FC } from 'react';

import styled from 'styled-components';

const BrandText = styled.span`
  font-weight: 400;
  font-size: 125%;
  font-family: "Yeseva One", serif;
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
      {prefix}{short ? 'Wr' : 'WriteRite'}{suffix}
    </BrandText>
  );
};

export default WrBrandText;
