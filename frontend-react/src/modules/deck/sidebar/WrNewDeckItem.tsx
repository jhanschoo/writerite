import React, { Component } from 'react';
import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { Flex } from 'rebass';

import Icon from '../../../ui/Icon';
import Button from '../../../ui/form/Button';
import Fieldset from '../../../ui/form/Fieldset';
import Legend from '../../../ui/form/Legend';
import TextInput from '../../../ui/form/TextInput';
import FlexSection from '../../../ui/FlexSection';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import { DeckCreateData, DeckCreateVariables, DECK_CREATE_MUTATION } from '../gql';

import { printApolloError } from '../../../util';

class WrNewDeckItem extends Component {
  public readonly state = {
    name: '',
  };

  public readonly render = () => {
    const { renderForm, handleCompleted } = this;
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
  }

  private readonly renderForm = (
    mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
    { loading }: MutationResult<DeckCreateData>,
  ) => {
    const { name } = this.state;
    const { handleChange } = this;
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
                px={0}
                py={0}
                color="fg"
                type="submit"
                disabled={name === '' || loading}
              >
                <Icon icon="plus" size={18} />
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
