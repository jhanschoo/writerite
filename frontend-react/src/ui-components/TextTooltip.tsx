import React, { PropsWithChildren, ReactNode } from "react";

import { wrStyled } from "../theme";
import { Tooltip } from "./Tooltip";

const TooltipText = wrStyled.p`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])};
margin: 0;
padding: ${({ theme: { space } }) => space[1]};
border-radius: 2px;
font-size: 75%;
`;

interface Props {
  text: ReactNode;
  placement?: "up" | "down" | "left" | "right";
}

export const TextTooltip = ({ children, text, placement }: PropsWithChildren<Props>): JSX.Element =>
  <Tooltip content={<TooltipText>{text}</TooltipText>} placement={placement}>
    {children}
  </Tooltip>;
