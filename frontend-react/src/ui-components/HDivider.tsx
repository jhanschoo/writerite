import React, { ReactNode } from "react";

import { ThemedStyledFunction } from "styled-components";
import { WrTheme, wrStyled } from "../theme";

const styledSpacerDiv: ThemedStyledFunction<"div", WrTheme, { spacerColor?: string }, never> = wrStyled.div;

const OuterBox = wrStyled.div`
display: flex;
align-items: center;
`;

const Spacer = styledSpacerDiv`
height: 1px;
flex-grow: 1;
background: ${({ spacerColor, theme }) => spacerColor ?? theme.bg[3]};
`;

const TextBox = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
`;

interface Props {
  spacerColor?: string;
  children?: ReactNode;
}

export const HDivider = ({ children, spacerColor }: Props): JSX.Element => {
  const labelAndHalf =
    <>
      <TextBox>
        {children}
      </TextBox>
      <Spacer spacerColor={spacerColor} />
    </>;
  return (
    <OuterBox>
      <Spacer spacerColor={spacerColor} />
      {children && labelAndHalf}
    </OuterBox>
  );
};
