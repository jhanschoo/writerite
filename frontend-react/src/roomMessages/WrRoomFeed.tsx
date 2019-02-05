import React, { Component, createRef } from 'react';

import { Query, QueryResult } from 'react-apollo';
import {
  ROOM_MESSAGES_QUERY, RoomMessagesData, RoomMessagesVariables,
} from './gql';
import WrRoomFeedSubscriptionHelper from './WrRoomFeedSubscriptionHelper';

import { Segment, Comment, Placeholder, Ref, Visibility } from 'semantic-ui-react';
import { emailToGravatarLink, printApolloError } from '../util';

import './WrRoomFeed.css';

interface Props {
  roomId: string;
}

interface State {
  pinToBottom: boolean;
}

const formattedLoadingFeed = [
  (
    <Comment key="room-feed-placeholder-0">
      <Comment.Content>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Comment.Content>
    </Comment>
  ), (
    <Comment key="room-feed-placeholder-1">
      <Comment.Content>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Comment.Content>
    </Comment>
  ),
];

class WrRoomFeed extends Component<Props, State> {
  public readonly state = {
    pinToBottom: true,
  };

  private feedRef = createRef<Element>();

  public readonly render = () => {
    const { roomId } = this.props;
    const { feedRef, renderComments, scrollFeedToBottom } = this;
    return (
      <Ref innerRef={feedRef}>
        <Segment className="room-content">
          <Query<RoomMessagesData, RoomMessagesVariables>
            query={ROOM_MESSAGES_QUERY}
            variables={{ roomId }}
            onCompleted={scrollFeedToBottom}
            onError={printApolloError}
          >
            {renderComments}
          </Query>
        </Segment>
      </Ref>
    );
  }

  private readonly scrollFeedToBottom = () => {
    if (!this.feedRef.current || !this.state.pinToBottom) {
      return;
    }
    const list = this.feedRef.current;
    list.scrollTop = list.scrollHeight - list.clientHeight;
  }

  private readonly setPinToBottom = () => {
    return this.setState({ pinToBottom: true });
  }

  private readonly unsetPinToBottom = () => {
    return this.setState({ pinToBottom: false });
  }

  private readonly renderComments = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomMessagesData, RoomMessagesVariables>) => {
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwRoomMessagesOfRoom)) {
      return null;
    }
    const { roomId } = this.props;
    const { setPinToBottom, unsetPinToBottom } = this;
    const formattedMessages = (loading || !data || !data.rwRoomMessagesOfRoom)
      ? formattedLoadingFeed
      : data.rwRoomMessagesOfRoom.map(({ id, content, sender }) => {
        const formattedLabel = !sender
          ? null
          : (
            <Comment.Avatar
              src={emailToGravatarLink(sender.email)}
              alt={`Gravatar of ${sender.email}`}
            />
          );
        const formattedSender = !sender
          ? null
          : (<Comment.Author>{sender.email}</Comment.Author>);
        return (
          <Comment key={id}>
            {formattedLabel}
            <Comment.Content>
              {formattedSender}
              <Comment.Text>
                {content}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        );
      });
    return (
      <>
        <WrRoomFeedSubscriptionHelper subscribeToMore={subscribeToMore} roomId={roomId} />
        <Visibility
          once={false}
          onBottomVisible={setPinToBottom}
          onBottomVisibleReverse={unsetPinToBottom}
        >
          <Comment.Group>
            {formattedMessages}
          </Comment.Group>
        </Visibility>
      </>
    );
  }
}

export default WrRoomFeed;
