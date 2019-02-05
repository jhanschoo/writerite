import { sendMessage } from './serveRoomUtil';
import { ApolloQueryResult } from 'apollo-client';
import { IRoomInfoData } from './gql';
import { createRedis } from './createRedis';

const [nodeBin, script, roomId, deckId] = process.argv;

const main = async (room: ApolloQueryResult<IRoomInfoData>) => {

  const messageSubscriber = createRedis();
  if (!room.data || !room.data.rwRoom) {
    throw new Error('Unable to obtain room info');
  }
  const cards = room.data.rwRoom.servingDeck.cards;
  let currentBack: string | null = null;

  const serveNextCard = (i: number) => {
    if (i >= cards.length) {
      sendMessage('deck has been served!');
      process.exit(0);
    } else {
      const card = cards[i];
      currentBack = card.back;
      sendMessage(`Next card: ${card.front}`);
      setTimeout(serveNextCard, 10_000, ++i);
    }
  };
  serveNextCard(0);

  const handleUserMessage = async (_roomChannel: string, content: string) => {
    const separator = content.indexOf(':');
    const userId = content.slice(0, separator);
    const message = content.slice(separator + 1);
    if (message === currentBack) {
      sendMessage('You got it!');
    }
    // TODO
  };

  messageSubscriber.subscribe(`writerite:room::${roomId}`);
  messageSubscriber.on('message', handleUserMessage);
};

const listener = process.on('message', (m) => {
  switch (m.operation) {
    case 'getRoomInfo':
      main(m.payload);
      break;
  }
});
