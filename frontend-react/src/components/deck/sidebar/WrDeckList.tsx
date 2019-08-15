import React, { useState, useRef } from 'react';
import { Filter } from 'react-feather';

import styled from 'styled-components';
import Fieldset from '../../../ui/form/Fieldset';
import { MinimalButton } from '../../../ui/form/Button';
import { MinimalTextInput } from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

import { OwnDecks_rwOwnDecks } from './gqlTypes/OwnDecks';

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
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

interface Content {
  id: string;
  el: JSX.Element;
}

interface Props {
  decks: readonly OwnDecks_rwOwnDecks[];
}

// TODO: use https://codesandbox.io/embed/7mqy09jyq to implement auto height with hooks
const WrDeckList = ({ decks }: Props) => {
  const [ filter, setFilter ] = useState(initialFilter);
  const inputEl = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputEl.current) {
      setFilter(inputEl.current.value);
    }
  };
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
    : filteredDecks.map((deck: OwnDecks_rwOwnDecks) => (
        <StyledItem key={deck.id}>
          <SidebarMenuLink to={`/deck/${deck.id}`} lang={deck.nameLang || undefined}>
            {deck.name}
          </SidebarMenuLink>
        </StyledItem>
    ));
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <FlexContainer>
            <StyledTextInput
              type="text"
              aria-label="Filter"
              placeholder="Filter..."
              value={filter}
              onChange={handleChange}
              ref={inputEl}
            />
            <MinimalButton
              type="submit"
              disabled={filter === ''}
            >
              <Filter size={14} />
            </MinimalButton>
          </FlexContainer>
        </Fieldset>
      </form>
      <List>
        {contents}
      </List>
    </>
  );
};

export default WrDeckList;
