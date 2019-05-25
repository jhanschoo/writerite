import { SCard, RwCard } from './RwCard';
import { SDeck, RwDeck } from './RwDeck';
import { SRoom, RwRoom } from './RwRoom';
import { SRoomMessage, RwRoomMessage } from './RwRoomMessage';
import { SUser, RwUser } from './RwUser';

const models = {
  SCard,
  SDeck,
  SRoom,
  SRoomMessage,
  SUser,
  RwCard,
  RwDeck,
  RwRoom,
  RwRoomMessage,
  RwUser,
};

export default models;

export type IModels = typeof models;
