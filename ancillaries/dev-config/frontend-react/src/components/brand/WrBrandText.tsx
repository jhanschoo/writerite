import React from "react";

import { wrStyled } from "src/theme";

const BrandText = wrStyled.span`
font-weight: 400;
font-size: 125%;
font-family: "Yeseva One", serif;
`;

interface Props {
  short?: boolean;
  prefix?: string;
  suffix?: string;
}

const WrBrandText = ({ prefix, short, suffix }: Props): JSX.Element => (
  <BrandText>
    {prefix}
    {short ? "Wr" : "WriteRite"}
    {suffix}
  </BrandText>
);
export default WrBrandText;
