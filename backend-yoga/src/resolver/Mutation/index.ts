import { authorizationMutation } from './authorization.mutation';
import { rwCardMutation } from './RwCard.mutation';
import { rwDeckMutation } from './RwDeck.mutation';
import { rwRoomMutation } from './RwRoom.mutation';
import { rwRoomMessageMutation } from './RwRoomMessage.mutation';

// tslint:disable-next-line: variable-name
const Mutation = {
  ...authorizationMutation,
  ...rwCardMutation,
  ...rwDeckMutation,
  ...rwRoomMutation,
  ...rwRoomMessageMutation,
};

export default Mutation;
