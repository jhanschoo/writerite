import React, { useState, useRef } from 'react';

import { WrDeck } from '../types';

import { Filter } from 'react-feather';

import { Flex } from 'rebass';
import Fieldset from '../../../ui/form/Fieldset';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const initialFilter = '';

interface Content {
  id: string;
  el: JSX.Element;
}

// TODO: use https://codesandbox.io/embed/7mqy09jyq to implement auto height with hooks
const WrDeckList = ({ decks }: { decks: WrDeck[] }) => {
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
      <Item width="100%" key="no-match">
        <em>There are no decks matching your filter.</em>
      </Item>
    )]
    : filteredDecks.map((deck: WrDeck) => (
        <Item width="100%" key={deck.id}>
          <SidebarMenuLink to={`/deck/${deck.id}`}>
            {deck.name}
          </SidebarMenuLink>
        </Item>
    ));
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Flex width="100%" alignItems="center">
            <TextInput
              variant="minimal"
              type="text"
              aria-label="Filter"
              placeholder="Filter..."
              px={2}
              py={1}
              value={filter}
              onChange={handleChange}
              ref={inputEl}
            />
            <Button
              variant="minimal"
              px={0}
              py={0}
              type="submit"
              disabled={filter === ''}
            >
              <Filter size={14} />
            </Button>
          </Flex>
        </Fieldset>
      </form>
      <List flexDirection="inherit">
        {contents}
      </List>
    </>
  );
};

export default WrDeckList;
