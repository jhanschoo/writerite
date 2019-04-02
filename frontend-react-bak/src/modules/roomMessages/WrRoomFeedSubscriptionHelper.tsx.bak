import { PureComponent } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import {
  ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
  RoomMessagesData, RoomMessageUpdatesData, RoomMessageUpdatesVariables,
} from './gql';
import { printApolloError } from '../util';
import { MutationType } from '../types';

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<
    RoomMessagesData, RoomMessageUpdatesVariables, RoomMessageUpdatesData
  >) => () => void;
  roomId: string;
}

class WrRoomFeedSubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const { roomId, subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<
      RoomMessagesData, RoomMessageUpdatesVariables, RoomMessageUpdatesData
    > = (prev, { subscriptionData }) => {
      const rwRoomMessagesOfRoom = (prev && prev.rwRoomMessagesOfRoom && prev.rwRoomMessagesOfRoom.slice()) || [];
      const { rwRoomMessageUpdatesOfRoom } = subscriptionData.data;
      // TODO: handle other types of updates
      if (rwRoomMessageUpdatesOfRoom.mutation === MutationType.CREATED) {
        rwRoomMessagesOfRoom.push(rwRoomMessageUpdatesOfRoom.new);
      }
      return Object.assign(
        {}, prev, { rwRoomMessagesOfRoom },
      );
    };

    subscribeToMore({
      document: ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
      variables: { roomId },
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrRoomFeedSubscriptionHelper;
