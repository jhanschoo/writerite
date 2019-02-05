import { rwCardQuery } from './RwCard.query';
import { rwDeckQuery } from './RwDeck.query';
import { rwRoomQuery } from './RwRoom.query';
import { rwUserQuery } from './RwUser.query';
import { rwRoomMessageQuery } from './RwRoomMessage.query';

// tslint:disable-next-line: variable-name
const Query = {
  ...rwCardQuery,
  ...rwDeckQuery,
  ...rwRoomQuery,
  ...rwRoomMessageQuery,
  ...rwUserQuery,
};

export default Query;
