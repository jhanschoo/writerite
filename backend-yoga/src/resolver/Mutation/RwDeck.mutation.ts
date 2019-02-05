import { IFieldResolver } from 'graphql-tools';

import {
  MutationType, IRwContext, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate,
} from '../../types';

import { pDeckToRwDeck, IBakedRwDeck } from '../RwDeck';
import {
  rwDeckTopic,
} from '../Subscription/RwDeck.subscription';
import { PDeck } from '../../../generated/prisma-client';
import {
  throwIfDevel, wrAuthenticationError, wrNotFoundError, wrGuardPrismaNullError, randomThreeWords,
} from '../../util';

const rwDeckSave: IFieldResolver<any, IRwContext, {
  id?: string,
  name?: string,
}> = async (
  _parent, { id, name }, { sub, prisma, pubsub },
): Promise<IBakedRwDeck | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (id) {
      if (!await prisma.$exists.pDeck({ id, owner: { id: sub.id } })) {
        throw wrNotFoundError('deck');
      }
      const pDeck = await prisma.updatePDeck({
        data: (name && name.trim()) ? { name: name.trim() } : {},
        where: { id },
      });
      wrGuardPrismaNullError(pDeck);
      const pDeckUpdate: IUpdatedUpdate<PDeck> = {
        mutation: MutationType.UPDATED,
        new: pDeck,
        oldId: null,
      };
      pubsub.publish(rwDeckTopic(), pDeckUpdate);
      return pDeckToRwDeck(pDeck, prisma);
    } else {
      const pDeck = await prisma.createPDeck({
        name: (name && name.trim()) ? name.trim() : randomThreeWords(),
        owner: { connect: { id: sub.id } },
      });
      wrGuardPrismaNullError(pDeck);
      const pDeckUpdate: ICreatedUpdate<PDeck> = {
        mutation: MutationType.CREATED,
        new: pDeck,
        oldId: null,
      };
      pubsub.publish(rwDeckTopic(), pDeckUpdate);
      return pDeckToRwDeck(pDeck, prisma);
    }
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwDeckDelete: IFieldResolver<any, IRwContext, {
  id: string,
}> = async (
  _parent: any,
  { id },
  { sub, prisma, pubsub },
): Promise<string | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (!await prisma.$exists.pDeck({ id, owner: { id: sub.id } })) {
      throw wrNotFoundError('deck');
    }
    const pDeck = await prisma.deletePDeck({ id });
    wrGuardPrismaNullError(pDeck);
    const pDeckUpdate: IDeletedUpdate<PDeck> = {
      mutation: MutationType.DELETED,
      new: null,
      oldId: pDeck.id,
    };
    pubsub.publish(rwDeckTopic(), pDeckUpdate);
    return pDeck.id;
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckMutation = {
  rwDeckSave, rwDeckDelete,
};
