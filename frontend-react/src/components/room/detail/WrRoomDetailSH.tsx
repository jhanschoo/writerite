import { PureComponent } from 'react';

import gql from 'graphql-tag';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { WR_ROOM_DETAIL, WR_ROOM_MESSAGE } from '../../../client-models';
import { RoomMessagesUpdates, RoomMessagesUpdatesVariables } from './gqlTypes/RoomMessagesUpdates';
import { RoomUpdates, RoomUpdatesVariables } from './gqlTypes/RoomUpdates';
import { RoomDetail } from './gqlTypes/RoomDetail';

const ROOM_MESSAGES_UPDATES_SUBSCRIPTION = gql`
${WR_ROOM_MESSAGE}
subscription RoomMessagesUpdates($roomId: ID!) {
  rwRoomMessagesUpdatesOfRoom(roomId: $roomId) {
    ... on RwRoomMessageCreated {
      created {
        ...WrRoomMessage
      }
    }
    ... on RwRoomMessageUpdated {
      updated {
        ...WrRoomMessage
      }
    }
    ... on RwRoomMessageDeleted {
      deletedId
    }
  }
}
`;

const ROOM_UPDATES_SUBSCRIPTION = gql`
${WR_ROOM_DETAIL}
subscription RoomUpdates($id: ID!) {
  rwRoomUpdates(id: $id) {
    ... on RwRoomCreated {
      created {
        ...WrRoomDetail
      }
    }
    ... on RwRoomUpdated {
      updated {
        ...WrRoomDetail
      }
    }
    ... on RwRoomDeleted {
      deletedId
    }
  }
}
`;

interface Props {
  subscribeToMore: ((options: SubscribeToMoreOptions<
    RoomDetail,
    RoomMessagesUpdatesVariables,
    RoomMessagesUpdates
  >) => () => void) & ((options: SubscribeToMoreOptions<
    RoomDetail,
    RoomUpdatesVariables,
    RoomUpdates
  >) => () => void);
  roomId: string;
}

class WrRoomDetailSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    this.subscribeToRoomMessagesUpdatesOfRoom();
    this.subscribeToRoomUpdates();
  }

  public readonly render = () => null;

  private subscribeToRoomMessagesUpdatesOfRoom = () => {
    const { subscribeToMore, roomId } = this.props;
    const updateQuery: UpdateQueryFn<
      RoomDetail,
      RoomMessagesUpdatesVariables,
      RoomMessagesUpdates
    > = (
      prev, { subscriptionData },
    ) => {
      let messages = (prev.rwRoom) ? [...prev.rwRoom.messages] : [];
      const { rwRoomMessagesUpdatesOfRoom } = subscriptionData.data;
      if ('created' in rwRoomMessagesUpdatesOfRoom && rwRoomMessagesUpdatesOfRoom.created) {
        const { created } = rwRoomMessagesUpdatesOfRoom;
        messages = messages.filter((message) => {
          return message.id !== created.id;
        }).concat([rwRoomMessagesUpdatesOfRoom.created]);
      }
      if ('updated' in rwRoomMessagesUpdatesOfRoom && rwRoomMessagesUpdatesOfRoom.updated) {
        const { updated } = rwRoomMessagesUpdatesOfRoom;
        messages = messages.map((message) => {
          if (message.id !== updated.id) {
            return message;
          }
          return updated;
        });
      }
      if ('deletedId' in rwRoomMessagesUpdatesOfRoom && rwRoomMessagesUpdatesOfRoom.deletedId) {
        const { deletedId } = rwRoomMessagesUpdatesOfRoom;
        messages = messages.filter((message) => {
          return message.id !== deletedId;
        });
      }
      return { ...prev, rwRoom: prev.rwRoom ? { ...prev.rwRoom, messages } : null };
    };
    subscribeToMore({
      document: ROOM_MESSAGES_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
      // workaround for insufficiently expressive type
      variables: { roomId },
    });
  }

  private subscribeToRoomUpdates = () => {
    const { subscribeToMore, roomId } = this.props;
    const updateQuery: UpdateQueryFn<
      RoomDetail,
      RoomUpdatesVariables,
      RoomUpdates
    > = (
      prev, { subscriptionData },
    ) => {
      let { rwRoom } = prev;
      const { rwRoomUpdates } = subscriptionData.data;
      if ('created' in rwRoomUpdates && rwRoomUpdates.created) {
        throw new Error('created property not expected on subscription');
      }
      if ('updated' in rwRoomUpdates && rwRoomUpdates.updated) {
        rwRoom = rwRoom && { ...rwRoom, ...rwRoomUpdates.updated };
      }
      if ('deletedId' in rwRoomUpdates && rwRoomUpdates.deletedId) {
        rwRoom = null;
      }
      return { ...prev, rwRoom };
    };
    subscribeToMore({
      document: ROOM_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
      // workaround for insufficiently expressive type
      variables: { id: roomId },
    });
  }
}

export default WrRoomDetailSH;
