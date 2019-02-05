import React, { Component, ChangeEvent, createRef } from 'react';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  CARD_CREATE_MUTATION, CardCreateData, CardCreateVariables,
} from './gql';

import { Card, Grid, Input, Button, Header } from 'semantic-ui-react';
import { printApolloError } from '../util';
import WrTooltip from '../WrTooltip';

interface Props {
  deckId: string;
}

interface State {
  frontInput: string;
  backInput: string;
  showInput: boolean;
}

class WrCardCreate extends Component<Props, State> {
  public readonly state = {
    frontInput: '',
    backInput: '',
    showInput: false,
  };

  private readonly focusRef = createRef<Input>();

  public readonly componentDidUpdate = (_prevProps: Props, prevState: State) => {
    const { showInput: prevShowInput } = prevState;
    const { showInput } = this.state;
    const { focusRef } = this;
    if (!prevShowInput && showInput && focusRef.current) {
      focusRef.current.focus();
    }
  }

  public readonly render = () => {
    const { resetState, renderCardCreate } = this;
    return (
      <Mutation<CardCreateData, CardCreateVariables>
        mutation={CARD_CREATE_MUTATION}
        onError={printApolloError}
        onCompleted={resetState}
      >
        {renderCardCreate}
      </Mutation>
    );
  }

  private readonly renderCardCreate = (
    mutate: MutationFn<CardCreateData, CardCreateVariables>,
    { loading }: MutationResult<CardCreateData>,
  ) => {
    const { frontInput, backInput, showInput } = this.state;
    const { deckId } = this.props;
    const {
      handleFrontInputChange, handleBackInputChange, handleSwapSides,
      handleShowInput, resetState, focusRef,
    } = this;
    const handleCardCreate = () => {
      return mutate({
        variables: {
          front: frontInput,
          back: backInput,
          deckId,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          resetState();
          break;
        case 'Enter':
          handleCardCreate();
          break;
      }
    };
    if (showInput) {
      return (
        <Card key="new-deck-0" onKeyDown={handleKeyPress}>
          <Card.Content>
            <Grid divided={true} stackable={true}>
              <Grid.Row>
                <Grid.Column width={6}>
                  <Header sub={true}>Front</Header>
                  <Input
                    fluid={true}
                    value={frontInput}
                    placeholder="Front..."
                    ref={focusRef}
                    onChange={handleFrontInputChange}
                  />
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header sub={true}>Back</Header>
                  <Input
                    fluid={true}
                    value={backInput}
                    placeholder="Back..."
                    onChange={handleBackInputChange}
                  />
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Button.Group>
                    <WrTooltip content="Cancel">
                      <Button
                        icon="undo"
                        onClick={resetState}
                      />
                    </WrTooltip>
                    <WrTooltip content="Swap front and back">
                      <Button
                        icon="exchange"
                        onClick={handleSwapSides}
                      />
                    </WrTooltip>
                    <WrTooltip content="Confirm">
                      <Button
                        loading={loading}
                        icon={(loading) ? undefined : 'play'}
                        primary={true}
                        onClick={handleCardCreate}
                      />
                    </WrTooltip>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card key="new-deck-0" onClick={handleShowInput}>
          <Card.Content textAlign="center">
            <Card.Header>
              New Card
            </Card.Header>
          </Card.Content>
        </Card>
      );
    }
  }

  private readonly handleFrontInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ frontInput: e.target.value });
  }

  private readonly handleBackInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ backInput: e.target.value });
  }

  private readonly handleSwapSides = () => {
    const { frontInput, backInput } = this.state;
    this.setState({ frontInput: backInput, backInput: frontInput });
  }

  private readonly handleShowInput = () => {
    this.setState({ showInput: true, frontInput: '', backInput: '' });
  }

  private readonly resetState = () => {
    this.setState({ showInput: false, frontInput: '', backInput: '' });
  }
}

export default WrCardCreate;
