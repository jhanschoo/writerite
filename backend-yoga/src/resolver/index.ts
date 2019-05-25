import { IResolvers, IResolverObject } from 'apollo-server-koa';

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import { RwCard } from './RwCard';
import { RwDeck } from './RwDeck';
import { RwRoom } from './RwRoom';
import { RwRoomMessage } from './RwRoomMessage';
import { RwUser } from './RwUser';
import { IContext } from '../types';

const resolvers: IResolverObject<any, IContext, any> = {
  Query,
  Mutation,
  Subscription,
  RwCard,
  RwDeck,
  RwRoom,
  RwRoomMessage,
  RwUser,
};

export default (resolvers as IResolvers<any, IContext>);
