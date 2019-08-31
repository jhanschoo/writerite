import React, { ReactNode } from 'react';

import styled, { ThemedStyledFunction } from 'styled-components';

const styledSpacerDiv: ThemedStyledFunction<'div', any, { spacerColor?: string }, never> = styled.div;

const OuterBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
`;

const Spacer = styledSpacerDiv`
width: 1px;
flex-grow: 1;
background: ${({ spacerColor, theme }) => spacerColor || theme.edge[1]};
`;

const TextBox = styled.div`
margin: ${({ theme }) => theme.space[2]};
`;

interface Props {
  spacerColor?: string;
  children?: ReactNode;
}

const VDivider = ({ children, spacerColor }: Props) => {
  const labelAndHalf = (
    <>
      <TextBox>
      {children}
      </TextBox>
      <Spacer spacerColor={spacerColor} />
    </>
  );
  return (
    <OuterBox>
      <Spacer spacerColor={spacerColor} />
      {children && labelAndHalf}
    </OuterBox>
  );
};

export default VDivider;
