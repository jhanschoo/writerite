import React, { Component } from 'react';
import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { Card, Flex } from 'rebass';
import styled from 'styled-components';

import Icon from '../../ui/Icon';
import Button from '../../ui/form/Button';
import Fieldset from '../../ui/form/Fieldset';
import Legend from '../../ui/form/Legend';
import TextInput from '../../ui/form/TextInput';

import { DeckCreateData, DeckCreateVariables, DECK_CREATE_MUTATION } from './gql';

import { printApolloError } from '../../util';

const NewDeckTextInput = styled(TextInput)`
  flex-grow: 1;
  font-weight: bold;
  padding: 0;
`;

class WrNewDeckItem extends Component {
  public readonly state = {
    name: '',
  };

  public readonly render = () => {
    const { renderForm, handleCompleted } = this;
    return (
      <Card
        p={2}
        border="1px solid"
        borderColor="edge"
        borderRadius={2}
      >
        <Mutation<DeckCreateData, DeckCreateVariables>
          mutation={DECK_CREATE_MUTATION}
          onError={printApolloError}
          onCompleted={handleCompleted}
        >
        {renderForm}
        </Mutation>
      </Card>
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
    }
    return (
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Legend>Create a New Deck</Legend>
            <Flex width="100%" alignItems="center">
              <NewDeckTextInput
                variant="minimal"
                aria-label="Title"
                placeholder="Title..."
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
