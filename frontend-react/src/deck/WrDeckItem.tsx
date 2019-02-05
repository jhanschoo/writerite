import React, { Component, ChangeEvent, createRef } from 'react';
import { WrDeck } from './types';
import { Card, Button, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import WrTooltip from '../WrTooltip';
import { MutationFn, MutationResult, Mutation } from 'react-apollo';
import {
  DeckDeleteData, DeckDeleteVariables, DECK_DELETE_MUTATION,
  DeckUpdateData, DeckUpdateVariables, DECK_UPDATE_MUTATION,
} from './gql';
import { printApolloError } from '../util';

enum Display {
  SHOW,
  EDIT,
  CONFIRM_DELETE,
}

interface Props {
  deck: WrDeck;
  mutable: boolean;
}

interface State {
  display: Display;
  nameInput: string;
}

const initialState: State = {
  display: Display.SHOW,
  nameInput: '',
};

class WrDeckItem extends Component<Props, State> {
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
    const { renderDeckItemShow, renderDeckItemEdit, renderDeckItemConfirmDelete } = this;
    const { display } = this.state;
    switch (display) {
      case Display.SHOW:
        return renderDeckItemShow();
      case Display.EDIT:
        return (
          <Mutation<DeckUpdateData, DeckUpdateVariables>
            mutation={DECK_UPDATE_MUTATION}
            onError={printApolloError}
            onCompleted={this.resetState}
          >
            {renderDeckItemEdit}
          </Mutation>
          );
      case Display.CONFIRM_DELETE:
        return renderDeckItemConfirmDelete();
      default:
        return null;
    }
  }

  private readonly renderDelete = (
    mutate: MutationFn<DeckDeleteData, DeckDeleteVariables>,
    { loading }: MutationResult<DeckDeleteData>,
  ) => {
    const { id } = this.props.deck;
    const { handleDisplayShow } = this;
    const handleDelete = () => mutate({
      variables: {
        id,
      },
    });
    return (
      <Card.Content extra={true} textAlign="center">
        <WrTooltip content="Back">
          <Button primary={true} onClick={handleDisplayShow} disabled={loading}>
            No, don't
          </Button>
        </WrTooltip>
        <WrTooltip content="Delete">
          <Button color="red" onClick={handleDelete}>
            Yes, delete
          </Button>
        </WrTooltip>
      </Card.Content>
    );
  }

  private readonly renderDeckItemEdit = (
    mutate: MutationFn<DeckUpdateData, DeckUpdateVariables>,
    { loading }: MutationResult<DeckUpdateData>,
  ) => {
    const { nameInput } = this.state;
    const { id } = this.props.deck;
    const { resetState, handleInputChange, focusRef } = this;
    const handleUpdateDeck = () => {
      return mutate({
        variables: {
          id,
          name: nameInput,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          resetState();
          break;
        case 'Enter':
          handleUpdateDeck();
          break;
      }
    };
    return (
    <Card key={id} onKeyDown={handleKeyPress}>
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
        <Button
          icon="undo"
          onClick={resetState}
        />
        <Button
          content="Confirm"
          icon="play"
          labelPosition="right"
          onClick={handleUpdateDeck}
          loading={loading}
          primary={true}
        />
      </Card.Content>
    </Card>
    );
  }

  private readonly renderDeckItemConfirmDelete = () => {
    const { id } = this.props.deck;
    const { renderDelete, resetState } = this;
    return (
      <Card key={id}>
        <Card.Content textAlign="center">
          <Card.Header>
            Are you sure?<br />This will delete all cards as well.
          </Card.Header>
        </Card.Content>
        <Mutation
          mutation={DECK_DELETE_MUTATION}
          onError={printApolloError}
          onCompleted={resetState}
        >
          {renderDelete}
        </Mutation>
      </Card>
    );
  }

  private readonly renderDeckItemShow = () => {
    const { mutable } = this.props;
    const { id, name, owner: { email } } = this.props.deck;
    const { handleDisplayEdit, handleDisplayConfirmDelete } = this;
    const renderIfMutable = mutable && (
      <Card.Content textAlign="center" extra={true}>
        <Button.Group>
          <WrTooltip content="Edit">
            <Button icon="edit" primary={true} onClick={handleDisplayEdit} />
          </WrTooltip>
          <WrTooltip content="Delete">
            <Button icon="trash" color="red" onClick={handleDisplayConfirmDelete} />
          </WrTooltip>
        </Button.Group>
      </Card.Content>
    );
    return (
      <Card key={id} as={Link} from="/dashboard/deck" to={`/dashboard/deck/${id}`}>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            by {email}
          </Card.Meta>
        </Card.Content>
        {renderIfMutable}
      </Card>
    );
  }

  private readonly resetState = () => {
    this.setState(initialState);
  }

  private readonly handleDisplayShow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ display: Display.SHOW });
  }

  private readonly handleDisplayEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { name } = this.props.deck;
    this.setState({ display: Display.EDIT, nameInput: name });
  }

  private readonly handleDisplayConfirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ display: Display.CONFIRM_DELETE });
  }

  private readonly handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }
}

export default WrDeckItem;
