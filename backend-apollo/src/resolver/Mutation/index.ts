import { IResolverObject } from 'graphql-tools';
import { IContext } from '../../types';

import { authorizationMutation } from './authorization.mutation';
import { rwUserMutation } from './RwUser.mutation';
import { rwCardMutation } from './RwCard.mutation';
import { rwDeckMutation } from './RwDeck.mutation';
import { rwRoomMutation } from './RwRoom.mutation';
import { rwRoomMessageMutation } from './RwRoomMessage.mutation';

// tslint:disable-next-line: variable-name
const Mutation: IResolverObject<any, IContext, any> = {
  ...authorizationMutation,
  ...rwUserMutation,
  ...rwCardMutation,
  ...rwDeckMutation,
  ...rwRoomMutation,
  ...rwRoomMessageMutation,
};

export default Mutation;
