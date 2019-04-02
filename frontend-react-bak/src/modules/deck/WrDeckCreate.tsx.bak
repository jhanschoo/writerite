import React, { Component, ChangeEvent, createRef } from 'react';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { DeckCreateData, DeckCreateVariables, DECK_CREATE_MUTATION } from './gql';
import { printApolloError } from '../util';

import { Card, Input, Button } from 'semantic-ui-react';
import WrTooltip from '../WrTooltip';

enum Display {
  LABEL,
  FORM,
}

type Props = object;

interface State {
  nameInput: string;
  display: Display;
}

const initialState: State = {
  nameInput: '',
  display: Display.LABEL,
};

class WrDeckCreate extends Component<Props, State> {
  public readonly state = initialState;

  private readonly focusRef = createRef<Input>();

  public readonly componentDidUpdate = (_prevProps: Props, prevState: State) => {
    const { display: prevDisplay } = prevState;
    const { display } = this.state;
    const { focusRef } = this;
    if (prevDisplay === Display.LABEL && display === Display.FORM && focusRef.current) {
      focusRef.current.focus();
    }
  }

  public readonly render = () => {
    const { resetState, renderDeckCreateLabel, renderDeckCreateForm } = this;
    const { display } = this.state;
    switch (display) {
      case Display.LABEL:
        return renderDeckCreateLabel();
      case Display.FORM:
        return (
          <Mutation<DeckCreateData, DeckCreateVariables>
            mutation={DECK_CREATE_MUTATION}
            onError={printApolloError}
            onCompleted={resetState}
          >
            {renderDeckCreateForm}
          </Mutation>
        );
      default:
        return null;
    }
  }

  private readonly renderDeckCreateLabel = () => {
    const { handleDisplayForm: handleCardClick } = this;
    return (
      <Card
        key="new-deck-0"
        onClick={handleCardClick}
      >
        <Card.Content>
          <Card.Header>
            New Deck
          </Card.Header>
        </Card.Content>
      </Card>
    );
  }

  private readonly renderDeckCreateForm = (
    mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
    { loading }: MutationResult<DeckCreateData>,
  ) => {
    const { nameInput } = this.state;
    const { handleInputChange, resetState, focusRef } = this;
    const handleNewDeck = () => {
      return mutate({
        variables: {
          name: nameInput || undefined,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          resetState();
          break;
        case 'Enter':
          handleNewDeck();
          break;
      }
    };
    return (
      <Card key="new-deck-0" onKeyDown={handleKeyPress}>
        <Card.Content>
          <Input
            fluid={true}
            value={nameInput}
            placeholder="Name..."
            disabled={loading}
            onChange={handleInputChange}
            ref={focusRef}
          />
        </Card.Content>
        <Card.Content extra={true} textAlign="center">
          <WrTooltip content="Cancel">
            <Button
              icon="undo"
              onClick={resetState}
            />
          </WrTooltip>
          <Button
            content="Confirm"
            icon="play"
            labelPosition="right"
            onClick={handleNewDeck}
            loading={loading}
            primary={true}
          />
        </Card.Content>
      </Card>
    );
  }

  private readonly handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly handleDisplayForm = () => {
    this.setState({ display: Display.FORM, nameInput: '' });
  }

  private readonly resetState = () => {
    this.setState(initialState);
  }
}

export default WrDeckCreate;
