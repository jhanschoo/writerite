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
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import { WrDeck, IWrDeck } from '../../../models/WrDeck';

const DECK_CREATE_MUTATION = gql`
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
  ${WrDeck}
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

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const StyledTextInput = styled(MinimalTextInput)`
  flex-grow: 1;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
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
            <FlexContainer>
              <StyledTextInput
                aria-label="Deck Name"
                placeholder="Type a deck name..."
                value={name}
                onChange={handleChange}
                disabled={loading}
              />
              <MinimalButton
                type="submit"
                disabled={name === '' || loading}
              >
                <Plus size={14} />
              </MinimalButton>
            </FlexContainer>
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
