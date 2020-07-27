import React, { CSSProperties } from "react";

import { wrStyled } from "../theme";

// aspect-ratio not really supported yet.
const SpinnerBox = wrStyled.div`
position: relative;
aspect-ratio: 1 / 1;
min-width: 10px;
min-height: 10px;
`;
const SpinnerElement = wrStyled.div`
position: absolute;
width: 50%;
height: 50%;
background: ${({ theme: { fg } }) => fg[1]};
animation: 1s ease-in-out infinite alternate grow-bottom-right;
`;
const SpinnerTL = wrStyled(SpinnerElement)`
right: 50%;
bottom: 50%;
animation-delay: -1s;
transform-origin: bottom right;
`;
const SpinnerTR = wrStyled(SpinnerElement)`
left: 50%;
bottom: 50%;
animation-delay: -0.5s;
transform-origin: bottom left;
`;
const SpinnerBR = wrStyled(SpinnerElement)`
left: 50%;
top: 50%;
transform-origin: top left;
`;
const SpinnerBL = wrStyled(SpinnerElement)`
right: 50%;
top: 50%;
animation-delay: -1.5s;
transform-origin: top right;
`;

interface Props {
  style?: CSSProperties;
}

export const Spinner = ({ style }: Props): JSX.Element => {
  const background = style?.color;
  return (
    <SpinnerBox style={style}>
      <SpinnerTL style={{ background }} />
      <SpinnerTR style={{ background }} />
      <SpinnerBL style={{ background }} />
      <SpinnerBR style={{ background }} />
    </SpinnerBox>
  );
};
