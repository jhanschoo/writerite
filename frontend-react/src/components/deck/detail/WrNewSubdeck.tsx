import React, { useState, MouseEvent } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { OWN_DECKS_QUERY } from '../sharedGql';
import { OwnDecks } from '../gqlTypes/OwnDecks';

import styled from 'styled-components';
import { BorderlessButton } from '../../../ui/Button';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import WrNewSubdeckItem from './WrNewSubdeckItem';
import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';

const OuterDiv = styled.div`
display: flex;
flex-direction: column;
align-items: stretch;
padding: ${({ theme }) => theme.space[2]};
border: 1px solid ${({ theme }) => theme.edge[0]};

&.active {
  border: 1px solid ${({ theme }) => theme.edge[1]};
}
`;

const CenteringDiv = styled.div`
display: flex;
justify-content: center;
`;

const StyledList = styled(List)`
flex-direction: row;
flex-wrap: wrap;
`;

const StyledButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

interface Props {
  deck: WrDeckDetail;
}

const WrNewSubdeck = ({ deck: { id, subdecks } }: Props) => {
  const [active, setActive] = useState(false);
  const {
    loading, data,
  } = useQuery<OwnDecks>(OWN_DECKS_QUERY, {
    onError: printApolloError,
  });
  const subdeckIds = subdecks.map((deck) => deck.id);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive(!active);
  };
  const optionalListItems = (loading || !data || (data.rwOwnDecks === null))
    ? (<Item>Fetching Decks...</Item>)
    : (data.rwOwnDecks.length === 0)
    ? (<Item>You have no decks.</Item>)
    : data.rwOwnDecks.filter((deck) => deck.id !== id && !subdeckIds.includes(deck.id)).map((deck) => (
      <WrNewSubdeckItem id={id} deck={deck} key={deck.id}/>
    ));
  const optionalList = active && (<StyledList>{optionalListItems}</StyledList>);
  return (
    <OuterDiv className={active ? 'active' : undefined}>
      <CenteringDiv>
        <StyledButton
          className={active ? 'active' : undefined}
          onClick={handleClick}
        >
          Add an existing deck as a sub-deck
        </StyledButton>
      </CenteringDiv>
      {optionalList}
    </OuterDiv>
  );
};

export default WrNewSubdeck;
