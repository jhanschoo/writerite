import React, { Component, ChangeEvent } from 'react';

import { Segment, Input } from 'semantic-ui-react';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  ROOM_MESSAGE_CREATE,
  RoomMessageCreateData, RoomMessageCreateVariables,
} from './gql';
import { printApolloError } from '../util';

interface OwnProps {
  roomId: string;
  disabled?: boolean;
}

type Props = OwnProps;

class WrRoomDetail extends Component<Props> {
  public readonly state = {
    inputValue: '',
  };

  public readonly render = () => {
    const { inputBox } = this;
    return (
      <Segment>
        <Mutation<RoomMessageCreateData, RoomMessageCreateVariables>
          mutation={ROOM_MESSAGE_CREATE}
          onCompleted={this.handleMessageSent}
          onError={printApolloError}
        >
          {inputBox}
        </Mutation>
      </Segment>
    );
  }

  private readonly inputBox = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
    { loading }: MutationResult<RoomMessageCreateData>,
  ) => {
    const { roomId, disabled } = this.props;
    const { inputValue } = this.state;
    const { handleInputMessageChange } = this;
    const handleSendMessage = () => mutate({
      variables: {
        roomId,
        content: inputValue,
      },
    });
    const buttonProps = {
      loading,
      icon: (loading) ? undefined : 'play',
      primary: true,
      onClick: handleSendMessage,
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          if (
            e.getModifierState('Alt') ||
            e.getModifierState('AltGraph') ||
            e.getModifierState('Control') ||
            e.getModifierState('Fn') ||
            e.getModifierState('Hyper') ||
            e.getModifierState('Meta') ||
            e.getModifierState('OS') ||
            e.getModifierState('Shift') ||
            e.getModifierState('Super') ||
            e.getModifierState('Symbol')
          ) {
            break;
          }
          handleSendMessage();
          break;
      }
    };
    return (
      <Input
        fluid={true}
        placeholder="Write a message..."
        value={this.state.inputValue}
        onChange={handleInputMessageChange}
        action={buttonProps}
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />
    );
  }

  private readonly handleInputMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  }

  private readonly handleMessageSent = (_data: RoomMessageCreateData) => {
    this.setState({ inputValue: '' });
  }
}

export default WrRoomDetail;
