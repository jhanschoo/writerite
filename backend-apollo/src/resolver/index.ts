import { IResolvers, IResolverObject } from 'apollo-server-koa';

import { Query } from "./query";
import Mutation from './Mutation';
import Subscription from './Subscription';
import { WrContext } from '../types';
import { unionTypeResolvers } from './unions';

const resolvers: IResolverObject<unknown, WrContext> = {
  Query,
  Mutation,
  Subscription,
  ...unionTypeResolvers,
  // Note: Upload resolver automatically added by apollo-server
};

export default resolvers as IResolvers<unknown, WrContext>;
