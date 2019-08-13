import gql from 'graphql-tag';
import { WrDeckDetail, IWrDeckDetail } from './client-models/WrDeckDetail';
import { WrRoomMessage, IWrRoomMessage } from './client-models/WrRoomMessage';
import { WrRoomMessageContentType } from './client-models/WrRoomMessageStub';
import { client } from './apolloClient';
import { quizServer, Round } from './quizServer';
import { IRoomConfig } from './client-models/WrRoomStub';

interface IConfigMessage {
  type: 'CONFIG';
  senderId: string;
  config: IRoomConfig;
}

interface IMessageMessage {
  type: 'MESSAGE';
  senderId: string;
  content: string;
}

type Message = IConfigMessage | IMessageMessage;

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

export const serveRoom = async (id: string, config: IRoomConfig) => {
  const ROOM_CHANNEL = `writerite:room::${id}`;
  const { deckId } = config;
  if (!deckId) {
    throw new Error('deckId not present in config');
  }
  const { data } = await getDeck(deckId);
  if (!data.rwDeck) {
    throw new Error('Unable to obtain room info');
  }
  const sendMessage = sendMessageFactory(id);
  let delay = 2000;
  const rounds: Round[] = [async () => {
    await sendMessage(WrRoomMessageContentType.CONFIG, '');
    return {
      rounds: [async () => {
        await sendMessage(
          WrRoomMessageContentType.TEXT,
          'Room not configured after 5 minutes. Stopping.',
        );
        return {};
      }],
      delay: 300000,
      messageHandler: (message: string) => {
        const messageObj: Message = JSON.parse(message);
        if (messageObj.type === 'CONFIG' && messageObj.config.clientDone) {
          const { roundLength } = messageObj.config;
          if (roundLength === undefined) {
            throw new Error('clientDone is true but roundLength is not present');
          }
          delay = roundLength;
          return { rounds };
        }
        return { delay: null };
      },
    };
  }, async () => {
    await sendMessage(
      WrRoomMessageContentType.TEXT,
      `Beginning to serve ${
        data.rwDeck && data.rwDeck.name
      } with an interval of ${Math.ceil(delay / 1000)} seconds per round.`,
    );
    return {};
  }];
  data.rwDeck.cards.forEach((card) => rounds.push(async () => {
    await sendMessage(WrRoomMessageContentType.TEXT, `Prompt: ${card.prompt}`);
    return {
      delay, messageHandler: async (message: string) => {
        const messageObj = JSON.parse(message);
        if (messageObj.type !== 'MESSAGE') {
          return { delay: null };
        }
        const { content } = messageObj;
        if (content === card.fullAnswer || card.answers.includes(content)) {
          await sendMessage(WrRoomMessageContentType.TEXT, 'You got it!');
        }
        return { delay: null };
      },
    };
  }));
  quizServer(ROOM_CHANNEL, rounds.reverse()).then(async () => {
    await sendMessage(WrRoomMessageContentType.TEXT, 'Done serving deck!');
  }, (reason) => {
    // tslint:disable-next-line: no-console
    console.error(reason);
  });
};
