import gql from 'graphql-tag';

import {
  WR_DECK_DETAIL, WR_ROOM_MESSAGE,
} from './client-models';
import { RwRoomMessageContentType } from './gqlGlobalTypes';
import { WrDeckDetail } from './client-models/gqlTypes/WrDeckDetail';
import { WrCard } from './client-models/gqlTypes/WrCard';
import { WrRoomStub_config } from './client-models/gqlTypes/WrRoomStub';
import { DeckDetail, DeckDetailVariables } from './gqlTypes/DeckDetail';
import { MessageCreate, MessageCreateVariables } from './gqlTypes/MessageCreate';

import { client } from './apolloClient';
import { quizServer, Round } from './quizServer';

interface IConfigMessage {
  type: 'CONFIG';
  senderId: string;
  config: WrRoomStub_config;
}

interface IMessageMessage {
  type: 'MESSAGE';
  senderId: string;
  content: string;
}

type Message = IConfigMessage | IMessageMessage;

export const SERVE_ROOM_CHANNEL = 'writerite:room:serving';

const DECK_DETAIL_QUERY = gql`
${WR_DECK_DETAIL}
query DeckDetail(
  $id: ID!
) {
  rwDeck(id: $id) {
    ...WrDeckDetail
  }
}
`;

export const MESSAGE_CREATE_MUTATION = gql`
${WR_ROOM_MESSAGE}
mutation MessageCreate($roomId: ID! $content: String! $contentType: RwRoomMessageContentType!) {
  rwRoomMessageCreate(roomId: $roomId content: $content contentType: $contentType) {
    ...WrRoomMessage
  }
}
`;

// tslint:disable-next-line: interface-name
export interface MessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
}

const getDeck = (id: string) => {
  return client.query<DeckDetail, DeckDetailVariables>({
    query: DECK_DETAIL_QUERY,
    variables: { id },
  });
};

const sendMessageFactory = (id: string) => (contentType: RwRoomMessageContentType, content: string) => {
  return client.mutate<MessageCreate, MessageCreateVariables>({
    mutation: MESSAGE_CREATE_MUTATION,
    variables: {
      roomId: id,
      content,
      contentType,
    },
  });
};

export const serveRoom = async (id: string, config: WrRoomStub_config) => {
  const ROOM_CHANNEL = `writerite:room::${id}`;
  const { deckId } = config;
  if (!deckId) {
    throw new Error('deckId not present in config');
  }
  const { data } = await getDeck(deckId);
  if (!data.rwDeck) {
    throw new Error('Unable to obtain room info');
  }

  // accumulate subdecks
  const deckQueue: WrDeckDetail[] = [data.rwDeck];
  const accumulatedDecks: { [key: string]: WrDeckDetail } = {};
  const cards: WrCard[] = [];
  while (deckQueue.length !== 0) {
    const deck = deckQueue.pop() as WrDeckDetail;
    cards.push(...deck.cards);
    accumulatedDecks[deck.id] = deck;
    for (const subdeck of deck.subdecks) {
      const { data: { rwDeck: subdeckDetail } } = await getDeck(subdeck.id);
      if (subdeckDetail) {
        deckQueue.push(subdeckDetail);
      }
    }
  }

  const sendMessage = sendMessageFactory(id);
  let delay = 2000;
  const rounds: Round[] = [async () => {
    await sendMessage(RwRoomMessageContentType.CONFIG, '');
    return {
      rounds: [async () => {
        await sendMessage(
          RwRoomMessageContentType.TEXT,
          'Room not configured after 5 minutes. Stopping.',
        );
        return {};
      }],
      delay: 300000,
      messageHandler: (message: string) => {
        const messageObj: Message = JSON.parse(message);
        if (messageObj.type === 'CONFIG' && messageObj.config.clientDone) {
          const { roundLength } = messageObj.config;
          if (roundLength === undefined || roundLength === null) {
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
      RwRoomMessageContentType.TEXT,
      `Beginning to serve ${
        data.rwDeck && data.rwDeck.name
      } with an interval of ${Math.ceil(delay / 1000)} seconds per round.`,
    );
    return {};
  }];
  for (const card of cards) {
    rounds.push(async () => {
      await sendMessage(RwRoomMessageContentType.TEXT, `Prompt: ${card.prompt}`);
      return {
        delay, messageHandler: async (message: string) => {
          const messageObj = JSON.parse(message);
          if (messageObj.type !== 'MESSAGE') {
            return { delay: null };
          }
          const { content } = messageObj;
          if (content === card.fullAnswer || card.answers.includes(content)) {
            await sendMessage(RwRoomMessageContentType.TEXT, 'You got it!');
          }
          return { delay: null };
        },
      };
    });
  }
  quizServer(ROOM_CHANNEL, rounds.reverse()).then(async () => {
    await sendMessage(RwRoomMessageContentType.TEXT, 'Done serving deck!');
  }, (reason) => {
    // tslint:disable-next-line: no-console
    console.error(reason);
  });
};
