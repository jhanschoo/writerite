import React, { Component, createRef, ChangeEvent } from 'react';
import { Card, Grid, Button, Input, Header } from 'semantic-ui-react';
import {
  CardEditData, CardEditVariables, CARD_EDIT_MUTATION,
  CardDeleteVariables, CardDeleteData, CARD_DELETE_MUTATION,
} from './gql';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../util';
import WrTooltip from '../WrTooltip';
import { WrCard } from './types';

enum Display {
  SHOW,
  EDIT,
}

interface Props {
  card: WrCard;
  deckId: string;
  mutable: boolean;
}

interface State {
  frontInput: string;
  backInput: string;
  display: Display;
}

const initialState = {
  frontInput: '',
  backInput: '',
  display: Display.SHOW,
};

class WrCardItem extends Component<Props, State> {
  public readonly state = initialState;

  private readonly focusRef = createRef<Input>();

  public readonly componentDidUpdate = (_prevProps: Props, prevState: State) => {
    const { display: prevDisplay } = prevState;
    const { display } = this.state;
    const { focusRef } = this;
    if (prevDisplay === Display.SHOW && display === Display.EDIT && focusRef.current) {
      focusRef.current.focus();
    }
  }

  public readonly render = () => {
    const { renderCardItemEdit, renderCardItemShow, handleResetState } = this;
    const { display } = this.state;
    switch (display) {
      case Display.SHOW:
        return renderCardItemShow();
      case Display.EDIT:
        return (
          <Mutation<CardEditData, CardEditVariables>
            mutation={CARD_EDIT_MUTATION}
            onError={printApolloError}
            onCompleted={handleResetState}
          >
            {renderCardItemEdit}
          </Mutation>
        );
      default:
        return null;
    }
  }

  private readonly renderCardItemShow = () => {
    const { mutable } = this.props;
    const { id, front, back } = this.props.card;
    const { handleShowInput, renderCardDelete } = this;
    const cardSidesWidth = (mutable) ? 6 : 8;
    const renderIfMutable = mutable && (
      <Grid.Column width={4} textAlign="center">
        <Button.Group>
          <WrTooltip content="Edit">
            <Button
              icon="edit"
              primary={true}
              onClick={handleShowInput}
            />
          </WrTooltip>
          <Mutation<CardDeleteData, CardDeleteVariables>
            mutation={CARD_DELETE_MUTATION}
            onError={printApolloError}
          >
            {renderCardDelete}
          </Mutation>
        </Button.Group>
      </Grid.Column>
    );
    return (
      <Card key={id}>
        <Card.Content>
          <Grid divided={true} stackable={true}>
            <Grid.Row>
              <Grid.Column width={cardSidesWidth}>
                <Header sub={true}>Front</Header>
                {front}
              </Grid.Column>
              <Grid.Column width={cardSidesWidth}>
                <Header sub={true}>Back</Header>
                {back}
              </Grid.Column>
              {renderIfMutable}
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  private readonly renderCardDelete = (
    mutate: MutationFn<CardDeleteData, CardDeleteVariables>,
    { loading }: MutationResult<CardDeleteData>,
  ) => {
    const { id } = this.props.card;
    const handleClick = () => {
      mutate({
        variables: { id },
      });
    };
    return (
      <WrTooltip content="Delete">
        <Button
          loading={loading}
          icon="trash"
          color="red"
          onClick={handleClick}
        />
      </WrTooltip>
    );
  }

  private readonly renderCardItemEdit = (
    mutate: MutationFn<CardEditData, CardEditVariables>,
    { loading }: MutationResult<CardEditData>,
  ) => {
    const { card: { id }, deckId } = this.props;
    const { frontInput, backInput } = this.state;
    const {
      handleFrontInputChange, handleBackInputChange,
      handleResetState, handleSwapSides,
      focusRef,
    } = this;
    const handleCardCreate = () => {
      return mutate({
        variables: {
          id,
          front: frontInput,
          back: backInput,
          deckId,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleResetState();
          break;
        case 'Enter':
          handleCardCreate();
          break;
      }
    };
    return (
      <Card key={id} onKeyDown={handleKeyPress}>
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
                      onClick={handleResetState}
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
  }

  private readonly handleFrontInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ frontInput: e.target.value });
  }

  private readonly handleBackInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ backInput: e.target.value });
  }

  private readonly handleShowInput = () => {
    const { front, back } = this.props.card;
    this.setState({ display: Display.EDIT, frontInput: front, backInput: back });
  }

  private readonly handleResetState = () => {
    this.setState(initialState);
  }

  private readonly handleSwapSides = () => {
    const { frontInput, backInput } = this.state;
    this.setState({ frontInput: backInput, backInput: frontInput });
  }
}

export default WrCardItem;
