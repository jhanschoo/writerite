import React, { useState } from 'react';
import { Search } from 'react-feather';

import styled from 'styled-components';
import { MinimalButton } from '../../../ui/Button';
import Fieldset from '../../../ui/Fieldset';
import { MinimalTextInput } from '../../../ui/TextInput';

const UppercaseLegend = styled.legend`
text-transform: uppercase;
`;

const FlexContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
`;

const SearchboxTextInput = styled(MinimalTextInput)`
flex-grow: 1;
padding: 0;
`;

const initialName = '';

const WrDeckSearchbox = () => {
  const [name, setName] = useState(initialName);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Fieldset>
        <UppercaseLegend>Search for a Deck</UppercaseLegend>
          <FlexContainer>
            <SearchboxTextInput
              type="search"
              aria-label="Search with part of a Deck Name"
              placeholder="Type a deck name..."
              value={name}
              onChange={handleChange}
            />
            <MinimalButton
              color="fg"
              type="submit"
              disabled={name === ''}
            >
              <Search size={18} />{/* TODO: convert to indicator */}
            </MinimalButton>
          </FlexContainer>
      </Fieldset>
    </form>
  );
}

export default WrDeckSearchbox;
