import React, { Component, ChangeEvent, createRef } from 'react';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { RoomCreateData, RoomCreateVariables, ROOM_CREATE_MUTATION } from './gql';
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

const initialState = {
  nameInput: '',
  display: Display.LABEL,
};

class WrNewRoom extends Component<Props, State> {
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
    const { renderRoomCreateLabel, renderRoomCreateForm, resetState } = this;
    const { display } = this.state;
    switch (display) {
      case Display.LABEL:
        return renderRoomCreateLabel();
      case Display.FORM:
        return (
          <Mutation<RoomCreateData, RoomCreateVariables>
            mutation={ROOM_CREATE_MUTATION}
            onError={printApolloError}
            onCompleted={resetState}
          >
            {renderRoomCreateForm}
          </Mutation>
        );
      default:
        return null;
    }
  }

  private readonly renderRoomCreateLabel = () => {
    const { handleDisplayForm } = this;
    return (
      <Card
        key="new-room-0"
        onClick={handleDisplayForm}
      >
        <Card.Content>
          <Card.Header>
            New Room
          </Card.Header>
        </Card.Content>
      </Card>
    );
  }

  private readonly renderRoomCreateForm = (
    mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
    { loading }: MutationResult<RoomCreateData>,
  ) => {
    const { nameInput } = this.state;
    const {
      handleNameInputChange, resetState, focusRef,
    } = this;
    const handleNewRoom = () => {
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
          handleNewRoom();
          break;
      }
    };
    return (
      <Card key="new-room-0" onKeyDown={handleKeyPress}>
        <Card.Content>
          <Input
            fluid={true}
            value={nameInput}
            placeholder="Name..."
            disabled={loading}
            onChange={handleNameInputChange}
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
            onClick={handleNewRoom}
            loading={loading}
            primary={true}
          />
        </Card.Content>
      </Card>
    );
  }

  private readonly handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly handleDisplayForm = () => {
    this.setState({ display: Display.FORM });
  }

  private readonly resetState = () => {
    this.setState(initialState);
  }
}

export default WrNewRoom;
