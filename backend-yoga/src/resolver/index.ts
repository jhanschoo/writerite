import { IResolvers, IResolverObject } from 'apollo-server-koa';

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import { IContext } from '../types';

const resolvers: IResolverObject<any, IContext, any> = {
  Query,
  Mutation,
  Subscription,
};

export default (resolvers as IResolvers<any, IContext>);
