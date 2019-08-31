import React, { useState } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_DECK } from '../../../client-models';
import { DeckCreate, DeckCreateVariables } from './gqlTypes/DeckCreate';

import styled from 'styled-components';
import { MinimalButton } from '../../../ui/Button';
import Fieldset from '../../../ui/Fieldset';
import { MinimalTextInput } from '../../../ui/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

const DECK_CREATE_MUTATION = gql`
${WR_DECK}
mutation DeckCreate(
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
  ) {
  rwDeckCreate(
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
  ) {
    ...WrDeck
  }
}
`;

const initialName = '';

const FlexSection = styled.section`
display: flex;
flex-direction: column;
margin-bottom: ${({ theme }) => theme.space[1]};
`;

const StyledList = styled(List)`
flex-direction: column;
`;

const StyledItem = styled(Item)`
margin: 1px 0;
`;

const StyledTextInput = styled(MinimalTextInput)`
flex-grow: 1;
padding: 0 ${({ theme }) => theme.space[1]};
`;

const WrNewDeck = () => {
  const [name, setName] = useState(initialName);
  const handleCompleted = () => {
    setName(initialName);
  };
  const [mutate, { loading }] = useMutation<DeckCreate, DeckCreateVariables>(
      DECK_CREATE_MUTATION, {
      onError: printApolloError,
      onCompleted: handleCompleted,
    },
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return mutate({
      variables: {
        name,
      },
    });
  };
  return (
    <FlexSection>
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <SidebarMenuHeader as="legend">Create a New Deck</SidebarMenuHeader>
            <StyledList>
              <StyledItem>
                <StyledTextInput
                  aria-label="Deck Name"
                  placeholder="Type a deck name..."
                  value={name}
                  required={true}
                  onChange={handleChange}
                  disabled={loading}
                />
                <MinimalButton
                  type="submit"
                  disabled={name === '' || loading}
                >
                  Add
                </MinimalButton>
              </StyledItem>
              <StyledItem>
                <SidebarMenuLink to="/deck/upload">
                  Import from CSV
                </SidebarMenuLink>
              </StyledItem>
            </StyledList>
        </Fieldset>
      </form>
    </FlexSection>
  );
};

export default WrNewDeck;
