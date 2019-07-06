import React, { useState } from 'react';
import { Plus } from 'react-feather';

import { gql } from 'graphql.macro';
import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import { MinimalButton } from '../../../ui/form/Button';
import Fieldset from '../../../ui/form/Fieldset';
import { MinimalTextInput } from '../../../ui/form/TextInput';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';
import SidebarMenuLink from '../../../ui/sidebar-menu/SidebarMenuLink';

import { WrDeck, IWrDeck } from '../../../models/WrDeck';

const DECK_CREATE_MUTATION = gql`
${WrDeck}
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

interface DeckCreateVariables {
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
}

interface DeckCreateData {
  readonly rwDeckCreate: IWrDeck | null;
}

const initialName = '';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleCompleted = () => {
    setName(initialName);
  };
  const renderForm = (
    mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
    { loading }: MutationResult<DeckCreateData>,
  ) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return mutate({
        variables: {
          name,
        },
      });
    };
    return (
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
                  <Plus size={14} />
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
    );
  };
  return (
    <FlexSection>
      <Mutation<DeckCreateData, DeckCreateVariables>
        mutation={DECK_CREATE_MUTATION}
        onError={printApolloError}
        onCompleted={handleCompleted}
      >
      {renderForm}
      </Mutation>
    </FlexSection>
  );
};

export default WrNewDeck;