import { IFieldResolver } from 'graphql-tools';

import { IRwContext, MutationType, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate } from '../../types';

import { pCardToRwCard, IBakedRwCard } from '../RwCard';
import {
  rwCardsTopicFromRwDeck,
} from '../Subscription/RwCard.subscription';
import { PSimpleCard } from '../../../generated/prisma-client';
import { throwIfDevel, wrAuthenticationError, wrNotFoundError, wrGuardPrismaNullError } from '../../util';

// Mutation resolvers

const rwCardCreate: IFieldResolver<any, IRwContext, {
  deckId: string, prompt?: string, fullAnswer?: string, sortKey?: string, template?: boolean,
}> = async (
  _parent,
  { deckId, prompt, fullAnswer, sortKey, template },
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
      prompt: prompt || '',
      fullAnswer: fullAnswer || '',
      sortKey: sortKey || prompt || '',
      deck: { connect: { id: deckId } },
      editedAt: (new Date()).toISOString(),
      template: template || false,
    });
    wrGuardPrismaNullError(pCard);
    const pCardUpdate: ICreatedUpdate<PSimpleCard> = {
      mutation: MutationType.CREATED,
      new: pCard,
      oldId: null,
    };
    pubsub.publish(rwCardsTopicFromRwDeck(deckId), pCardUpdate);
    return pCardToRwCard(pCard, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwCardEdit: IFieldResolver<any, IRwContext, {
  id: string, prompt?: string, fullAnswer?: string, sortKey?: string, template?: boolean,
}> = async (
  _parent,
  { id, prompt, fullAnswer, sortKey, template },
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
      data: {
        prompt,
        fullAnswer,
        sortKey,
        editedAt: (new Date()).toISOString(),
        template,
      },
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
    pubsub.publish(rwCardsTopicFromRwDeck(pDeck.id), pCardUpdate);
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
    pubsub.publish(rwCardsTopicFromRwDeck(pDecks[0].id), pCardUpdate);
    return pCard.id;
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwCardMutation = {
  rwCardCreate, rwCardEdit, rwCardDelete,
};
