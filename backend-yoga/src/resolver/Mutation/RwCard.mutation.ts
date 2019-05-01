import { IFieldResolver } from 'graphql-tools';

import { IRwContext, MutationType, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate } from '../../types';

import { pCardToRwCard, IBakedRwCard } from '../RwCard';
import {
  rwCardTopicFromRwDeck,
} from '../Subscription/RwCard.subscription';
import { PSimpleCard } from '../../../generated/prisma-client';
import { throwIfDevel, wrAuthenticationError, wrNotFoundError, wrGuardPrismaNullError } from '../../util';

// Mutation resolvers

const rwCardCreate: IFieldResolver<any, IRwContext, {
  deckId: string, front?: string, back?: string, sortKey?: string,
}> = async (
  _parent,
  { deckId, front, back, sortKey },
  { prisma, sub, pubsub },
): Promise<IBakedRwCard | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (!await prisma.$exists.pDeck({ id: deckId, owner: { id: sub.id } })) {
      throw wrNotFoundError('deck');
    }
    const pCard = await prisma.createPSimpleCard({
      front: front || '',
      back: back || '',
      sortKey: sortKey || front || '',
      deck: { connect: { id: deckId } },
    });
    wrGuardPrismaNullError(pCard);
    const pCardUpdate: ICreatedUpdate<PSimpleCard> = {
      mutation: MutationType.CREATED,
      new: pCard,
      oldId: null,
    };
    pubsub.publish(rwCardTopicFromRwDeck(deckId), pCardUpdate);
    return pCardToRwCard(pCard, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwCardUpdate: IFieldResolver<any, IRwContext, {
  id: string, front?: string, back?: string, sortKey?: string,
}> = async (
  _parent,
  { id, front, back, sortKey },
  { prisma, sub, pubsub },
): Promise<IBakedRwCard | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (!await prisma.$exists.pSimpleCard({
      id,
      deck: {
        owner: { id: sub.id },
      },
    })) {
      throw wrNotFoundError('card');
    }
    const pCard = await prisma.updatePSimpleCard({
      data: { front, back, sortKey },
      where: { id },
    });
    const pDeck = await prisma.pSimpleCard({ id }).deck();
    wrGuardPrismaNullError(pCard);
    wrGuardPrismaNullError(pDeck);
    const pCardUpdate: IUpdatedUpdate<PSimpleCard> = {
      mutation: MutationType.UPDATED,
      new: pCard,
      oldId: null,
    };
    pubsub.publish(rwCardTopicFromRwDeck(pDeck.id), pCardUpdate);
    return pCardToRwCard(pCard, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwCardDelete: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma, sub, pubsub },
): Promise<string | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    const pDecks = await prisma.pDecks({
      where: { cards_some: { id }, owner: { id: sub.id } },
    });
    if (pDecks.length !== 1) {
      throw wrNotFoundError('card');
    }
    const pCard = await prisma.deletePSimpleCard({ id });
    wrGuardPrismaNullError(pCard);
    const pCardUpdate: IDeletedUpdate<PSimpleCard> = {
      mutation: MutationType.DELETED,
      new: null,
      oldId: pCard.id,
    };
    pubsub.publish(rwCardTopicFromRwDeck(pDecks[0].id), pCardUpdate);
    return pCard.id;
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwCardMutation = {
  rwCardCreate, rwCardUpdate, rwCardDelete,
};
