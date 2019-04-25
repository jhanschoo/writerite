import React, { useState } from 'react';
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

const SearchboxTextInput = styled(TextInput)`
  flex-grow: 1;
  padding: 0;
`;

const initialName = '';

const WrDeckSearchbox = () => {
  const [name, setName] = useState(initialName);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleCompleted = () => {
    setName(initialName);
  };
  const renderForm = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };
    return (
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Legend>Search for a Deck</Legend>
            <Flex width="100%" alignItems="center">
              <SearchboxTextInput
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
  };
  return (
    <WideCard
      p={2}
    >
      {renderForm()}
    </WideCard>
  );
}

export default WrDeckSearchbox;
