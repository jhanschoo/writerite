import { PureComponent } from 'react';

import { gql } from 'graphql.macro';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';

import { WrRoomDetail, IWrRoomDetail } from '../../../client-models/WrRoomDetail';
import { RoomDetailData } from './WrRoomDetail';
import { MutationType, Payload } from '../../../types';
import { WrRoomMessage, IWrRoomMessage } from '../../../client-models/WrRoomMessage';

const ROOM_MESSAGES_UPDATES_SUBSCRIPTION = gql`
${WrRoomMessage}
subscription RoomMessagesUpdates($roomId: ID!) {
  rwRoomMessagesUpdatesOfRoom(roomId: $roomId) {
    mutation
    new {
      ...WrRoomMessage
    }
    oldId
  }
}
`;

interface RoomMessagesUpdatesVariables {
  readonly roomId: string;
}

type RoomMessagesUpdatesPayload = Payload<IWrRoomMessage>;

interface RoomMessagesUpdatesData {
  readonly rwRoomMessagesUpdatesOfRoom: RoomMessagesUpdatesPayload;
}

const ROOM_UPDATES_SUBSCRIPTION = gql`
${WrRoomDetail}
subscription RoomUpdates($id: ID!) {
  rwRoomUpdates(id: $id) {
    mutation
    new {
      ...WrRoomDetail
    }
    oldId
  }
}
`;

interface RoomUpdatesVariables {
  readonly id: string;
}

type RoomUpdatesPayload = Payload<IWrRoomDetail>;

interface RoomUpdatesData {
  readonly rwRoomUpdates: RoomUpdatesPayload;
}

interface Props {
  subscribeToMore: ((options: SubscribeToMoreOptions<
    RoomDetailData,
    RoomMessagesUpdatesVariables,
    RoomMessagesUpdatesData
  >) => () => void) & ((options: SubscribeToMoreOptions<
    RoomDetailData,
    RoomUpdatesVariables,
    RoomUpdatesData
  >) => () => void);
  roomId: string;
}

class WrRoomDetailSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    this.subscribeToRoomMessagesUpdatesOfRoom();
  }

  public readonly render = () => null;

  private subscribeToRoomMessagesUpdatesOfRoom = () => {
    const { subscribeToMore, roomId } = this.props;
    const updateQuery: UpdateQueryFn<
      RoomDetailData,
      RoomMessagesUpdatesVariables,
      RoomMessagesUpdatesData
    > = (
      prev, { subscriptionData },
    ) => {
      let messages = (prev.rwRoom) ? prev.rwRoom.messages : [];
      const { rwRoomMessagesUpdatesOfRoom } = subscriptionData.data;
      switch (rwRoomMessagesUpdatesOfRoom.mutation) {
        case MutationType.CREATED:
          // https://github.com/apollographql/react-apollo/issues/2656
          messages = messages.filter((message: IWrRoomMessage) => {
            return message.id !== rwRoomMessagesUpdatesOfRoom.new.id;
          }).concat([rwRoomMessagesUpdatesOfRoom.new]);
          break;
        case MutationType.UPDATED:
          messages = messages.map((message: IWrRoomMessage) => {
            if (message.id !== rwRoomMessagesUpdatesOfRoom.new.id) {
              return message;
            }
            return rwRoomMessagesUpdatesOfRoom.new;
          });
          break;
        case MutationType.DELETED:
          messages = messages.filter((message: IWrRoomMessage) => {
            return message.id !== rwRoomMessagesUpdatesOfRoom.oldId;
          });
          break;
        default:
          throw new Error('Invalid MutationType');
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
      RoomDetailData,
      RoomUpdatesVariables,
      RoomUpdatesData
    > = (
      prev, { subscriptionData },
    ) => {
      let room = prev.rwRoom;
      const { rwRoomUpdates } = subscriptionData.data;
      switch (rwRoomUpdates.mutation) {
        case MutationType.CREATED:
          throw new Error('CREATED not expected on subscription');
        case MutationType.UPDATED:
          room = room && { ...room, ...rwRoomUpdates.new };
          break;
        case MutationType.DELETED:
          room = null;
          break;
        default:
          throw new Error('Invalid MutationType');
      }
      return { ...prev, rwRoom: room };
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
