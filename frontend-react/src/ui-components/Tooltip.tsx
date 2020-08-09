// eslint-disable-next-line no-shadow
import React, { MouseEvent, PropsWithChildren, ReactNode, useState } from "react";

import { wrStyled } from "src/theme";

interface Props {
  content: ReactNode;
  placement?: "up" | "down" | "left" | "right";
}

const Wrapper = wrStyled.div`
position: relative;
`;

const Anchor = wrStyled.div`
position: absolute;
display: flex;
width: 0;
height: 0;

&.hidden {
  display: none;
}
&.down {
  bottom: 0;
  left: 50%;
  justify-content: center;
}
&.up {
  top: 0;
  left: 50%;
  justify-content: center;
}
&.left {
  left: 0;
  top: 50%;
  align-items: center;
}
&.right {
  right: 0;
  top: 50%;
  align-items: center;
}
`;

const TooltipDiv = wrStyled.div`
position: absolute;
&.down {
  top: ${({ theme: { space } }) => space[2]};
}
&.up {
  bottom: ${({ theme: { space } }) => space[2]};
}
&.left {
  right: ${({ theme: { space } }) => space[2]};
}
&.right {
  left: ${({ theme: { space } }) => space[2]};
}
`;

export const Tooltip = ({ children, content, placement = "down" }: PropsWithChildren<Props>): JSX.Element => {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = (_e: MouseEvent<HTMLElement>) => setIsHover(true);
  const handleMouseLeave = (_e: MouseEvent<HTMLElement>) => setIsHover(false);
  return <Wrapper>
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
    <Anchor className={`${placement} ${isHover ? "" : "hidden"}`}>
      <TooltipDiv className={placement}>
        {content}
      </TooltipDiv>
    </Anchor>
  </Wrapper>;
};
