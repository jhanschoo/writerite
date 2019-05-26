import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext } from '../../types';

import { IRwDeck } from '../../model/RwDeck';

const rwDeck: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma },
): Promise<IRwDeck | null> => {
  return models.RwDeck.get(prisma, id);
};

const rwOwnDecks: IFieldResolver<any, IContext, {}> = async (
  _parent, _args, { models, prisma, sub },
): Promise<IRwDeck[] | null> => {
  if (!sub) {
    return null;
  }
  return models.RwDeck.getFromUserId(prisma, sub.id);
};

export const rwDeckQuery: IResolverObject<any, IContext, any> = {
  rwDeck, rwOwnDecks,
};
