import React, { ReactNode } from 'react';

import styled from 'styled-components';
import Tooltip from './Tooltip';

const Text = styled.p`
background: ${({ theme }) => theme.color.fg2};
color: ${({ theme }) => theme.color.bg1};
margin: 0;
padding: ${({ theme }) => theme.space[1]};
border-radius: 2px;
font-size: 75%;
`;

interface Props {
  children: ReactNode;
  text: ReactNode;
  placement?: 'up' | 'down' | 'left' | 'right';
}

const TextTooltip = ({ children, text, placement }: Props) => {
  return (
    <Tooltip content={<Text>{text}</Text>} placement={placement}>
      {children}
    </Tooltip>
  );
};

export default TextTooltip;
