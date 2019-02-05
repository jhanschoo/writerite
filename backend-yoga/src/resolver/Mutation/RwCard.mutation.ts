import { IFieldResolver } from 'graphql-tools';

import { IRwContext, MutationType, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate } from '../../types';

import { pCardToRwCard, IBakedRwCard } from '../RwCard';
import {
  rwCardTopicFromRwDeck,
} from '../Subscription/RwCard.subscription';
import { PSimpleCard } from '../../../generated/prisma-client';
import { throwIfDevel, wrAuthenticationError, wrNotFoundError, wrGuardPrismaNullError } from '../../util';

// Mutation resolvers

const rwCardSave: IFieldResolver<any, IRwContext, {
  id?: string, front: string, back: string, sortKey?: string, deckId: string,
}> = async (
  _parent,
  { id, front, back, sortKey, deckId },
  { prisma, sub, pubsub },
): Promise<IBakedRwCard | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (id) {
      if (!await prisma.$exists.pSimpleCard({
        id,
        deck: {
          id: deckId,
          owner: { id: sub.id },
        },
      })) {
        throw wrNotFoundError('card');
      }
      const pCard = await prisma.updatePSimpleCard({
        data: { front, back, sortKey },
        where: { id },
      });
      wrGuardPrismaNullError(pCard);
      const pCardUpdate: IUpdatedUpdate<PSimpleCard> = {
        mutation: MutationType.UPDATED,
        new: pCard,
        oldId: null,
      };
      pubsub.publish(rwCardTopicFromRwDeck(deckId), pCardUpdate);
      return pCardToRwCard(pCard, prisma);
    } else {
      if (!await prisma.$exists.pDeck({ id: deckId, owner: { id: sub.id } })) {
        throw wrNotFoundError('deck');
      }
      const pCard = await prisma.createPSimpleCard({
        front,
        back,
        sortKey: sortKey || front,
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
    }
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
  rwCardSave, rwCardDelete,
};
