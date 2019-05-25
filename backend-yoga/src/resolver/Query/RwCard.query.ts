import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext } from '../../types';
import { IRwCard } from '../../model/RwCard';

// Query resolvers

const rwCard: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma },
): Promise<IRwCard | null> => {
  return models.RwCard.get(prisma, id);
};

const rwCardsOfDeck: IFieldResolver<any, IContext, { deckId: string }> = async (
  _parent, { deckId }, { models, prisma },
): Promise<IRwCard[] | null> => {
  return models.RwCard.getFromDeckId(prisma, deckId);
};

export const rwCardQuery: IResolverObject<any, IContext> = {
  rwCard, rwCardsOfDeck,
};
