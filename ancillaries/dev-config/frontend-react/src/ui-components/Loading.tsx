import React from "react";

import { WrTheme, wrStyled } from "src/theme";

import { Spinner } from "./Spinner";

const LoadingBackground = wrStyled.div`
position: absolute;
width: 100%;
height: 100%;
z-index: 100;
background: ${({ theme: { color } }) => color.whiten};
display: grid;
justify-content: center;
align-content: center;
font-weight: bold;
text-align: center;
`;

const LoadingContent = wrStyled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

interface Props {
  fontSize?: WrTheme["scale"][number];
}

export const Loading = ({ fontSize }: Props): JSX.Element => (
  <LoadingBackground>
    <LoadingContent>
      <p style={{ fontSize, marginTop: 0 }}>Loading...</p>
      <Spinner
        style={{
          width: 40,
          height: 40,
          marginRight: 10, // compensation for ellipses
        }}
      />
    </LoadingContent>
  </LoadingBackground>
);
