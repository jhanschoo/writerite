import { IFieldResolver } from 'graphql-tools';

import {
  MutationType, IRwContext, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate,
} from '../../types';

import { pDeckToRwDeck, IBakedRwDeck } from '../RwDeck';
import {
  rwOwnDecksTopicFromOwner, rwDeckTopic,
} from '../Subscription/RwDeck.subscription';
import { PDeck } from '../../../generated/prisma-client';
import {
  throwIfDevel, wrAuthenticationError, wrNotFoundError, wrGuardPrismaNullError, randomThreeWords,
} from '../../util';

const rwDeckCreate: IFieldResolver<any, IRwContext, {
  name?: string,
  nameLang?: string,
  promptLang?: string,
  answerLang?: string,
}> = async (
  _parent, { name, nameLang, promptLang, answerLang }, { sub, prisma, pubsub },
): Promise<IBakedRwDeck | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    const pDeck = await prisma.createPDeck({
      name: name || randomThreeWords(),
      nameLang: nameLang || '',
      promptLang: promptLang || '',
      answerLang: answerLang || '',
      owner: { connect: { id: sub.id } },
    });
    wrGuardPrismaNullError(pDeck);
    const pDeckUpdate: ICreatedUpdate<PDeck> = {
      mutation: MutationType.CREATED,
      new: pDeck,
      oldId: null,
    };
    pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), pDeckUpdate);
    pubsub.publish(rwDeckTopic(pDeck.id), pDeckUpdate);
    return pDeckToRwDeck(pDeck, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwDeckEdit: IFieldResolver<any, IRwContext, {
  id: string,
  name: string,
  nameLang: string,
  promptLang: string,
  answerLang: string,
}> = async (
  _parent, { id, name, nameLang, promptLang, answerLang }, { sub, prisma, pubsub },
): Promise<IBakedRwDeck | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (!await prisma.$exists.pDeck({ id, owner: { id: sub.id } })) {
      throw wrNotFoundError('deck');
    }
    const pDeck = await prisma.updatePDeck({
      data: { name, nameLang, promptLang, answerLang },
      where: { id },
    });
    wrGuardPrismaNullError(pDeck);
    const pDeckUpdate: IUpdatedUpdate<PDeck> = {
      mutation: MutationType.UPDATED,
      new: pDeck,
      oldId: null,
    };
    pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), pDeckUpdate);
    pubsub.publish(rwDeckTopic(pDeck.id), pDeckUpdate);
    return pDeckToRwDeck(pDeck, prisma);
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
    pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), pDeckUpdate);
    pubsub.publish(rwDeckTopic(pDeck.id), pDeckUpdate);
    return pDeck.id;
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckMutation = {
  rwDeckCreate, rwDeckEdit, rwDeckDelete,
};
