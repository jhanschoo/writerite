import React, { FC } from 'react';

import styled from 'styled-components';

const BrandText = styled.span`
  font-weight: bold;
  font-size: 150%;
  font-family: "Josefin Slab", serif;
`;

const HideableText = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    display: none;
  }
`;

interface Props {
  responsive?: boolean;
  prefix?: string;
  suffix?: string;
}

const WrBrandText: FC<Props> = (props: Props) => {
  const { prefix, responsive, suffix } = props;
  return (
    <BrandText>
      {prefix}W{responsive ? <HideableText>riteRite</HideableText> : 'riteRite'}{suffix}
    </BrandText>
  );
};

export default WrBrandText;
