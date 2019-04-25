import React, { useState } from 'react';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DeckCreateData, DeckCreateVariables, DECK_CREATE_MUTATION } from '../gql';

import { Plus } from 'react-feather';

import { Flex } from 'rebass';
import FlexSection from '../../../ui/FlexSection';
import Button from '../../../ui/form/Button';
import Fieldset from '../../../ui/form/Fieldset';
import Legend from '../../../ui/form/Legend';
import TextInput from '../../../ui/form/TextInput';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

const initialName = '';

const WrNewDeck = () => {
  const [name, useName] = useState(initialName);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useName(e.target.value);
  };
  const handleCompleted = () => {
    useName(initialName);
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
          <SidebarMenuHeader as={Legend}>Create a New Deck</SidebarMenuHeader>
            <Flex width="100%" alignItems="center">
              <TextInput
                variant="minimal"
                aria-label="Deck Name"
                placeholder="Type a deck name..."
                px={2}
                py={1}
                value={name}
                onChange={handleChange}
                disabled={loading}
              />
              <Button
                variant="minimal"
                px={0}
                py={0}
                type="submit"
                disabled={name === '' || loading}
              >
                <Plus size={18} />
              </Button>
            </Flex>
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
