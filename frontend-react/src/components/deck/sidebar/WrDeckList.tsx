import React, { useState, useRef } from 'react';

import styled from 'styled-components';
import Fieldset from '../../../ui/Fieldset';
import { MinimalTextInput } from '../../../ui/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

import { WrDeck } from '../../../client-models/gqlTypes/WrDeck';
import HDivider from '../../../ui-components/HDivider';

const initialFilter = '';

const FlexContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
`;

const StyledItem = styled(Item)`
margin: 2px 0;
`;

const StyledTextInput = styled(MinimalTextInput)`
flex-grow: 1;
padding: ${({ theme }) => theme.space[1]};
`;

interface Props {
  decks: readonly WrDeck[];
}

// TODO: use https://codesandbox.io/embed/7mqy09jyq to implement auto height with hooks
const WrDeckList = ({ decks }: Props) => {
  const [ filter, setFilter ] = useState(initialFilter);
  const inputEl = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  const filteredDecks = decks.filter((deck) => {
    return filter === '' || deck.name.includes(filter);
  });
  const contents = (filteredDecks.length === 0)
    ? [(
      <StyledItem key="no-match">
        <em>There are no decks matching your filter.</em>
      </StyledItem>
    )]
    : filteredDecks.map((deck) => (
        <StyledItem key={deck.id}>
          <SidebarMenuLink to={`/deck/${deck.id}`} lang={deck.nameLang || undefined}>
            {deck.name}
          </SidebarMenuLink>
        </StyledItem>
    ));
  return (
    <>
      <FlexContainer>
        <StyledTextInput
          type="text"
          aria-label="Filter"
          placeholder="Filter..."
          value={filter}
          onChange={handleChange}
          ref={inputEl}
        />
      </FlexContainer>
      <HDivider />
      <List>
        {contents}
      </List>
    </>
  );
};

export default WrDeckList;
