import gql from 'graphql-tag';
import { WrRoomDetail, IWrRoomDetail } from './models/WrRoomDetail';
import { WrRoomMessage, IWrRoomMessage } from './models/WrRoomMessage';
import { WrRoomMessageContentType } from './models/WrRoomMessageStub';
import { client } from './apolloClient';
import { createClient } from './redisClient';

export const SERVE_ROOM_CHANNEL = 'writerite:room:serving';

const ROOM_DETAIL_QUERY = gql`
${WrRoomDetail}
query RoomDetail(
  $id: ID!
) {
  rwRoom(id: $id) {
    ...WrRoomDetail
  }
}
`;

// tslint:disable-next-line: interface-name
export interface RoomDetailVariables {
  readonly id: string;
}

// tslint:disable-next-line: interface-name
export interface RoomDetailData {
  readonly rwRoom: IWrRoomDetail | null;
}

export const MESSAGE_CREATE_MUTATION = gql`
mutation MessageCreate($roomId: ID! $content: String! $contentType: RwRoomMessageContentType!) {
  rwRoomMessageCreate(roomId: $roomId content: $content contentType: $contentType) {
    ...WrRoomMessage
  }
}
${WrRoomMessage}
`;

// tslint:disable-next-line: interface-name
export interface MessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
  readonly contentType: WrRoomMessageContentType;
}

// tslint:disable-next-line: interface-name
export interface MessageCreateData {
  readonly rwRoomMessageCreate: IWrRoomMessage | null;
}

const getRoom = (id: string) => {
  return client.query<RoomDetailData, RoomDetailVariables>({
    query: ROOM_DETAIL_QUERY,
    variables: { id },
  });
};

const sendMessageFactory = (id: string) => (contentType: WrRoomMessageContentType, content: string) => {
  return client.mutate<MessageCreateData, MessageCreateVariables>({
    mutation: MESSAGE_CREATE_MUTATION,
    variables: {
      roomId: id,
      content,
      contentType,
    },
  });
};

export const serveRoom = (id: string) => {
  const ROOM_CHANNEL = `writerite:room::${id}`;
  const redisClient = createClient();
  redisClient.on('ready', () => setTimeout(async () => {
    const { data } = await getRoom(id);
    if (!data.rwRoom) {
      throw new Error('Unable to obtain room info');
    }
    const sendMessage = sendMessageFactory(id);
    await sendMessage(WrRoomMessageContentType.TEXT, 'serving room');
    await sendMessage(WrRoomMessageContentType.CONFIG, '');
    const cards = data.rwRoom.deck.cards;
    let currentlyServing = -1;
    const handleMessage = (message: string) => {
      if (message === cards[currentlyServing].fullAnswer) {
        sendMessage(WrRoomMessageContentType.TEXT, 'You got it!');
        serveCard(currentlyServing + 1);
      }
    };
    redisClient.subscribe(ROOM_CHANNEL);
    redisClient.on('message', (channel: string, message: string) => {
      const separator = message.indexOf(':');
      const userId = message.slice(0, separator);
      const content = message.slice(separator + 1);
      if (channel === ROOM_CHANNEL) {
        handleMessage(content);
      }
    });
    const closeRoom = async () => {
      // redisClient.unsubscribe(ROOM_CHANNEL);
      await sendMessage(WrRoomMessageContentType.TEXT, 'Done serving room!');
    };
    const serveCard = async (i: number) => {
      if (i <= currentlyServing) {
        return;
      }
      if (i === cards.length) {
        return await closeRoom();
      }
      currentlyServing = i;
      await sendMessage(WrRoomMessageContentType.TEXT, `Next Card: ${cards[i].prompt}`);
      return setTimeout(serveCard, 10000, i + 1);
    };
    setTimeout(serveCard, 1000, 0);
  }, 5000));
};
