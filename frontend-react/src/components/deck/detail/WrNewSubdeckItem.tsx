import React, { MouseEvent } from 'react';
import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK_SCALARS } from '../../../client-models/WrDeckScalars';
import { DeckAddSubdeck, DeckAddSubdeckVariables } from './gqlTypes/DeckAddSubdeck';

import styled from 'styled-components';
import Item from '../../../ui/list/Item';
import { BorderlessButton } from '../../../ui/Button';

const DECK_ADD_SUBDECK_MUTATION = gql`
${WR_DECK_SCALARS}
mutation DeckAddSubdeck($id: ID!, $subdeckId: ID!) {
  deckAddSubdeck(id: $id, subdeckId: $subdeckId) {
    ...WrDeckScalars
  }
}
`;

const StyledDeckButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
margin: ${({ theme }) => theme.space[2]};
${({ theme }) => theme.fgbg[4]}

&.active, :hover {
  ${({ theme }) => theme.fgbg[2]}
}
`;

interface Props {
  id: string;
  deck: WrDeck;
}

const WrNewSubdeckItem = ({ id, deck: { id: subdeckId, name, promptLang } }: Props) => {
  const [mutate] = useMutation<DeckAddSubdeck, DeckAddSubdeckVariables>(
    DECK_ADD_SUBDECK_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate({
      variables: { id, subdeckId },
    });
  };
  return (
    <Item>
      <StyledDeckButton
        lang={promptLang || undefined}
        onClick={handleClick}
      >
        {name}
      </StyledDeckButton>
    </Item>
  );
};

export default WrNewSubdeckItem;
