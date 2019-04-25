import React, { useState, useRef, ReactNode, ReactNodeArray } from 'react';

import { WrDeck } from '../types';

import { animated, useTransition } from 'react-spring';
import { Filter } from 'react-feather';

import { Flex } from 'rebass';
import Fieldset from '../../../ui/form/Fieldset';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const AnimatedItem = animated(Item);

const initialFilter = '';

interface Content {
  id: string;
  el: JSX.Element;
}

// TODO: use https://codesandbox.io/embed/7mqy09jyq to implement auto height with hooks
const WrDeckList = ({ decks }: { decks: WrDeck[] }) => {
  const [ filter, setFilter ] = useState(initialFilter);
  const [refs] = useState<{[key: string]: HTMLDivElement}>({});
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
    ? [{
      id: 'placeholder',
      el: (<em>There are no matching decks</em>),
    }]
    : filteredDecks.map((deck: WrDeck) => ({
      id: deck.id,
      el: (
        <SidebarMenuLink to={`/deck/${deck.id}`}>
          {deck.name}
        </SidebarMenuLink>
      ),
    }));
  // Note: defect in library typings, hence the `object` argument and `any` for `next` and `cancel`.
  const transitions = useTransition<Content, object>(contents, (content) => content.id, {
    from: { opacity: 0, height: 0 },
    enter: (item) => async (next: any, cancel: any) => {
      await next({ opacity: 0, height: 0 }); // initialize refs
      await next({
        opacity: 1,
        height: refs[item.id] ? refs[item.id].getBoundingClientRect().height : 0,
      });
    },
    leave: (item) => {
      delete refs[item.id];
      return { opacity: 0, height: 0 };
    },
  });
  const wrapItem = (
    { key, item, props }: { key: string, item: Content, props: {} },
    ) => (
    <AnimatedItem key={key} style={props}>
      <div ref={(ref) => ref && (refs[item.id] = ref)}>
        {item.el}
      </div>
    </AnimatedItem>
  );
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
              <Filter size={18} />
            </Button>
          </Flex>
        </Fieldset>
      </form>
      <List flexDirection="inherit">
        {transitions.map(wrapItem)}
      </List>
    </>
  );
};

export default WrDeckList;
