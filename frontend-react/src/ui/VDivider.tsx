import React, { FC, ReactNode } from 'react';

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
  background: ${({ spacerColor, theme }) => spacerColor ? theme.colors[spacerColor] : theme.colors.darkEdge};
`;

const TextBox = styled.div`
  margin: ${({ theme }) => theme.space[2]};
`;

interface Props {
  spacerColor?: string;
  children?: ReactNode;
}

const VDivider: FC<Props> = (props: Props) => {
  const { children, spacerColor } = props;
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
