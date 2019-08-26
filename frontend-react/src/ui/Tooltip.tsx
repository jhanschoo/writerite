import React, { useState, ReactNode, MouseEvent } from 'react';

import styled from 'styled-components';

interface Props {
  children: ReactNode;
  content: ReactNode;
  placement?: 'up' | 'down' | 'left' | 'right';
}

const Wrapper = styled.div`
position: relative;
`;

const Anchor = styled.div`
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

const TooltipDiv = styled.div`
position: absolute;
&.down {
  top: ${({ theme }) => theme.space[2]};
}
&.up {
  bottom: ${({ theme }) => theme.space[2]};
}
&.left {
  right: ${({ theme }) => theme.space[2]};
}
&.right {
  left: ${({ theme }) => theme.space[2]};
}
`;

const Tooltip = ({ children, content, placement = 'down' }: Props) => {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => setIsHover(true);
  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => setIsHover(false);
  return (
    <Wrapper>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      <Anchor className={`${placement} ${isHover ? '' : 'hidden'}`}>
        <TooltipDiv className={placement}>
          {content}
        </TooltipDiv>
      </Anchor>
    </Wrapper>
  );
};

export default Tooltip;
