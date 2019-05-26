import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext, MutationType, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate } from '../../types';

import { rwCardsTopicFromRwDeck } from '../Subscription/RwCard.subscription';
import { rwAuthenticationError, rwNotFoundError } from '../../util';
import { ISCard, IRwCard } from '../../model/RwCard';

// Mutation resolvers

const rwCardCreate: IFieldResolver<any, IContext, {
  deckId: string,
  prompt?: string,
  fullAnswer?: string,
  sortKey?: string,
  template?: boolean,
}> = async (
  _parent,
  { deckId, ...params },
  { models, prisma, sub, pubsub },
): Promise<IRwCard | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pDeck({ id: deckId, owner: { id: sub.id } })) {
    throw rwNotFoundError('deck');
  }
  const sCard = await models.SCard.create(prisma, {
    ...params, deckId,
  });
  const sCardUpdate: ICreatedUpdate<ISCard> = {
    mutation: MutationType.CREATED,
    new: sCard,
    oldId: null,
  };
  pubsub.publish(rwCardsTopicFromRwDeck(deckId), sCardUpdate);
  return models.RwCard.fromSCard(prisma, sCard);
};

const rwCardsCreate: IFieldResolver<any, IContext, {
  deckId: string,
  multiplicity: number,
  prompt?: string,
  fullAnswer?: string,
  sortKey?: string,
  template?: boolean,
}> = async (
  _parent,
  { deckId, multiplicity, ...params },
  { models, prisma, sub, pubsub },
): Promise<IRwCard[] | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pDeck({ id: deckId, owner: { id: sub.id } })) {
    throw rwNotFoundError('deck');
  }
  const sCards = await models.SCard.createMany(prisma, multiplicity, {
    ...params, deckId,
  });
  sCards.forEach((sCard) => {
    const sCardUpdate: ICreatedUpdate<ISCard> = {
      mutation: MutationType.CREATED,
      new: sCard,
      oldId: null,
    };
    pubsub.publish(rwCardsTopicFromRwDeck(deckId), sCardUpdate);
  });
  return sCards.map((sCard) => models.RwCard.fromSCard(prisma, sCard));
};

const rwCardEdit: IFieldResolver<any, IContext, {
  id: string,
  prompt?: string,
  fullAnswer?: string,
  sortKey?: string,
  template?: boolean,
}> = async (
  _parent,
  { id, ...params },
  { models, prisma, sub, pubsub },
): Promise<IRwCard | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pCard({
    id,
    deck: {
      owner: { id: sub.id },
    },
  })) {
    throw rwNotFoundError('card');
  }
  const sCard = await models.SCard.edit(prisma, {
    ...params, id,
  });
  const rwCard = models.RwCard.fromSCard(prisma, sCard);
  const rwDeck = await rwCard.deck();
  const sCardUpdate: IUpdatedUpdate<ISCard> = {
    mutation: MutationType.UPDATED,
    new: sCard,
    oldId: null,
  };
  pubsub.publish(rwCardsTopicFromRwDeck(rwDeck.id), sCardUpdate);
  return rwCard;
};

const rwCardDelete: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma, sub, pubsub },
): Promise<string | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const pDecks = await prisma.pDecks({
    where: { cards_some: { id }, owner: { id: sub.id } },
  });
  if (pDecks.length !== 1) {
    throw rwNotFoundError('card');
  }
  const oldId = await models.SCard.delete(prisma, id);
  const sCardUpdate: IDeletedUpdate<ISCard> = {
    mutation: MutationType.DELETED,
    new: null,
    oldId,
  };
  pubsub.publish(rwCardsTopicFromRwDeck(pDecks[0].id), sCardUpdate);
  return oldId;
};

export const rwCardMutation: IResolverObject<any, IContext, any> = {
  rwCardCreate, rwCardsCreate, rwCardEdit, rwCardDelete,
};
