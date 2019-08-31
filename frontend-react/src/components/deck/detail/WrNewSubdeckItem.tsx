import React, { MouseEvent } from 'react';
import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';

import styled from 'styled-components';
import Item from '../../../ui/list/Item';
import { BorderlessButton } from '../../../ui/Button';

const StyledDeckButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
${({ theme }) => theme.fgbg[4]}

&.active, :hover {
  ${({ theme }) => theme.fgbg[2]}
}
`;

interface Props {
  deck: WrDeck;
}

const WrNewSubdeckItem = ({ deck: { name, nameLang } }: Props) => {
  return (
    <Item>
      <StyledDeckButton
        lang={nameLang}
      >
        {name}
      </StyledDeckButton>
    </Item>
  );
};

export default WrNewSubdeckItem;
