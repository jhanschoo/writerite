import React, { Component } from 'react';
import { Search } from 'react-feather';

import styled from 'styled-components';
import { Card, Flex } from 'rebass';
import Button from '../../../ui/form/Button';
import Fieldset from '../../../ui/form/Fieldset';
import Legend from '../../../ui/form/Legend';
import TextInput from '../../../ui/form/TextInput';

const WideCard = styled(Card)`
  grid-column: 1 / 4;
`;

const NewDeckTextInput = styled(TextInput)`
  flex-grow: 1;
  padding: 0;
`;

class WrNewDeckItem extends Component {
  public readonly state = {
    name: '',
  };

  public readonly render = () => {
    const { renderForm, handleCompleted } = this;
    return (
      <WideCard
        p={2}
      >
        {renderForm()}
      </WideCard>
    );
  }

  private readonly renderForm = () => {
    const { name } = this.state;
    const { handleChange } = this;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };
    return (
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Legend>Search for a Deck</Legend>
            <Flex width="100%" alignItems="center">
              <NewDeckTextInput
                variant="minimal"
                type="search"
                aria-label="Search with part of a Deck Name"
                placeholder="Type a deck name..."
                value={name}
                onChange={handleChange}
              />
              <Button
                variant="minimal"
                px={0}
                py={0}
                color="fg"
                type="submit"
                disabled={name === ''}
              >
                <Search size={18} />{/* TODO: convert to indicator */}
              </Button>
            </Flex>
        </Fieldset>
      </form>
    );
  }

  private readonly handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  }

  private readonly handleCompleted = () => {
    this.setState({ name: '' });
  }
}

export default WrNewDeckItem;
