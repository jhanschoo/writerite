import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Flex } from 'rebass';

import { WrDeck } from '../types';

import Icon from '../../../ui/Icon';
import Fieldset from '../../../ui/form/Fieldset';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

class WrDeckList extends Component<{ decks: WrDeck[] }, { filter: string }> {
  public readonly state = {
    filter: '',
  };

  private readonly inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  public readonly render = () => {
    const { decks } = this.props;
    const { filter } = this.state;
    const { handleSubmit, handleChange, inputRef } = this;
    const formattedDecks = decks.filter((deck) => {
      return filter === '' || deck.name.includes(filter);
    }).map((deck: WrDeck) => (
      <CSSTransition key={deck.id} timeout={250} classNames="fade">
        <Item>
          <SidebarMenuLink to={`/deck/${deck.id}`}>
            {deck.name}
          </SidebarMenuLink>
        </Item>
      </CSSTransition>
    ));
    const placeholder = (
      <CSSTransition timeout={250} classNames="fade">
        <Item p={2}><em>There are no matching decks</em></Item>
      </CSSTransition>
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
                ref={inputRef}
              />
              <Button
                px={0}
                py={0}
                color="fg"
                type="submit"
                disabled={name === ''}
              >
                <Icon icon="filter" size={18} />
              </Button>
            </Flex>
          </Fieldset>
        </form>
        <List flexDirection="inherit">
          <TransitionGroup component={null}>
            {formattedDecks.length ? formattedDecks : placeholder}
          </TransitionGroup>
        </List>
      </>
    );
  }

  private readonly handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { inputRef } = this;
    e.preventDefault();
    if (inputRef.current) {
      this.setState({ filter: inputRef.current.value });
    }
  }

  private readonly handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filter: e.target.value });
  }
}

export default WrDeckList;
