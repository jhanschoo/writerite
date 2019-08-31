import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import {
  IContext, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate, IUpload,
} from '../../types';

import {
  rwOwnDecksTopicFromOwner, rwDeckTopic,
} from '../Subscription/RwDeck.subscription';
import { PDeck } from '../../../generated/prisma-client';
import { rwAuthenticationError } from '../../util';
import { ISDeck, IRwDeck } from '../../model/RwDeck';

const rwDeckCreate: IFieldResolver<any, IContext, {
  name?: string, description?: string, nameLang?: string, promptLang?: string, answerLang?: string,
}> = async (
  _parent, params, { models, sub, prisma, pubsub },
): Promise<IRwDeck | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const sDeck = await models.SDeck.create(prisma, { ...params, userId: sub.id });
  const sDeckUpdate: ICreatedUpdate<ISDeck> = { created: sDeck };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(sDeck.id), sDeckUpdate);
  return models.RwDeck.fromSDeck(prisma, sDeck);
};

const rwDeckCreateFromRows: IFieldResolver<any, IContext, {
  name?: string,
  description?: string,
  nameLang?: string,
  promptLang?: string,
  answerLang?: string,
  rows: string[][],
}> = async (
  _parent, params, { models, sub, prisma, pubsub },
): Promise<IRwDeck | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const sDeck = await models.SDeck.createFromRows(prisma, {
    ...params,
    userId: sub.id,
  });
  const sDeckUpdate: ICreatedUpdate<ISDeck> = { created: sDeck };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(sDeck.id), sDeckUpdate);
  return models.RwDeck.fromSDeck(prisma, sDeck);
};

const rwDeckEdit: IFieldResolver<any, IContext, {
  id: string,
  name?: string,
  description?: string,
  nameLang?: string,
  promptLang?: string,
  answerLang?: string,
}> = async (
  _parent, { id, ...params }, { models, sub, prisma, pubsub },
): Promise<IRwDeck | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pDeck({ id, owner: { id: sub.id } })) {
    return null;
  }
  const sDeck = await models.SDeck.edit(prisma, { ...params, id });
  const sDeckUpdate: IUpdatedUpdate<ISDeck> = { updated: sDeck };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(sDeck.id), sDeckUpdate);
  return models.RwDeck.fromSDeck(prisma, sDeck);
};

const rwDeckDelete: IFieldResolver<any, IContext, {
  id: string,
}> = async (
  _parent: any,
  { id },
  { models, sub, prisma, pubsub },
): Promise<string | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pDeck({ id, owner: { id: sub.id } })) {
    return null;
  }
  const deletedId = await models.SDeck.delete(prisma, id);
  const sDeckUpdate: IDeletedUpdate<PDeck> = { deletedId };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(deletedId), sDeckUpdate);
  return deletedId;
};

export const rwDeckMutation: IResolverObject<any, IContext, any> = {
  rwDeckCreate, rwDeckCreateFromRows, rwDeckEdit, rwDeckDelete,
};
