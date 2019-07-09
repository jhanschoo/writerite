import gql from 'graphql-tag';
import { WrDeckDetail, IWrDeckDetail } from './models/WrDeckDetail';
import { WrRoomMessage, IWrRoomMessage } from './models/WrRoomMessage';
import { WrRoomMessageContentType } from './models/WrRoomMessageStub';
import { client } from './apolloClient';
import { createClient } from './redisClient';
import { IRoomConfig } from './models/WrRoomStub';

export const SERVE_ROOM_CHANNEL = 'writerite:room:serving';

const DECK_DETAIL_QUERY = gql`
${WrDeckDetail}
query DeckDetail(
  $id: ID!
) {
  rwDeck(id: $id) {
    ...WrDeckDetail
  }
}
`;

// tslint:disable-next-line: interface-name
export interface DeckDetailVariables {
  readonly id: string;
}

// tslint:disable-next-line: interface-name
export interface DeckDetailData {
  readonly rwDeck: IWrDeckDetail | null;
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

const getDeck = (id: string) => {
  return client.query<DeckDetailData, DeckDetailVariables>({
    query: DECK_DETAIL_QUERY,
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

export const serveRoom = (id: string, config: IRoomConfig) => {
  const ROOM_CHANNEL = `writerite:room::${id}`;
  const { deckId } = config;
  if (!deckId) {
    throw new Error('deckId not present in config');
  }
  const redisClient = createClient();
  redisClient.on('ready', () => setTimeout(async () => {
    const { data } = await getDeck(deckId);
    if (!data.rwDeck) {
      throw new Error('Unable to obtain room info');
    }
    const sendMessage = sendMessageFactory(id);
    await sendMessage(WrRoomMessageContentType.TEXT, 'serving room');
    await sendMessage(WrRoomMessageContentType.CONFIG, '');
    const cards = data.rwDeck.cards;
    let currentlyServing = -1;
    const handleMessage = (message: string) => {
      if (message === cards[currentlyServing].fullAnswer) {
        sendMessage(WrRoomMessageContentType.TEXT, 'You got it!');
        serveCard(currentlyServing + 1);
      }
    };
    redisClient.subscribe(ROOM_CHANNEL);
    redisClient.on('message', (channel: string, message: string) => {
      // TODO: write an interface for message JSON for backend-apollo and wright-node
      const { contentType, content, senderId } = JSON.parse(message);
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
