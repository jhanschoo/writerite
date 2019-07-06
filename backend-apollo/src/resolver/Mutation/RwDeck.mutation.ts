import { IFieldResolver, IResolverObject } from 'apollo-server-koa';
import parse from 'csv-parse';

import {
  MutationType, IContext, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate, IUpload,
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
  const sDeckUpdate: ICreatedUpdate<ISDeck> = {
    mutation: MutationType.CREATED,
    new: sDeck,
    oldId: null,
  };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(sDeck.id), sDeckUpdate);
  return models.RwDeck.fromSDeck(prisma, sDeck);
};

const rwDeckCreateFromCsv: IFieldResolver<any, IContext, {
  name?: string,
  description?: string,
  nameLang?: string,
  promptLang?: string,
  answerLang?: string,
  csv: IUpload,
}> = async (
  _parent, { name, csv, ...params }, { models, sub, prisma, pubsub },
): Promise<IRwDeck | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const { filename, mimetype, createReadStream } = await csv;
  const stream = createReadStream();
  return new Promise((res, rej) => {
    const parser = parse();
    stream.pipe(parser);
    const rows: string[][] = [];
    parser.on('error', (err) => rej(err));
    parser.on('readable', () => {
      let row: string[] = parser.read();
      while (row) {
        while (row.length < 2) {
          row.push('');
        }
        rows.push(row);
        row = parser.read();
      }
    });
    parser.on('end', async () => {
      // save output
      const sDeck = await models.SDeck.createFromRows(prisma, {
        ...params,
        userId: sub.id,
        name: name || filename,
        rows,
      });
      const sDeckUpdate: ICreatedUpdate<ISDeck> = {
        mutation: MutationType.CREATED,
        new: sDeck,
        oldId: null,
      };
      pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
      pubsub.publish(rwDeckTopic(sDeck.id), sDeckUpdate);
      res(models.RwDeck.fromSDeck(prisma, sDeck));
    });
  });
};

const rwDeckCreateFromRows: IFieldResolver<any, IContext, {
  name?: string,
  description?: string,
  nameLang?: string,
  promptLang?: string,
  answerLang?: string,
  rows: string[][],
}> = async (
  _parent, { ...params }, { models, sub, prisma, pubsub },
): Promise<IRwDeck | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const sDeck = await models.SDeck.createFromRows(prisma, {
    ...params,
    userId: sub.id,
  });
  const sDeckUpdate: ICreatedUpdate<ISDeck> = {
    mutation: MutationType.CREATED,
    new: sDeck,
    oldId: null,
  };
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
  const sDeck = await models.SDeck.edit(prisma, { ...params, id });
  const sDeckUpdate: IUpdatedUpdate<ISDeck> = {
    mutation: MutationType.UPDATED,
    new: sDeck,
    oldId: null,
  };
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
  const oldId = await models.SDeck.delete(prisma, id);
  const sDeckUpdate: IDeletedUpdate<PDeck> = {
    mutation: MutationType.DELETED,
    new: null,
    oldId,
  };
  pubsub.publish(rwOwnDecksTopicFromOwner(sub.id), sDeckUpdate);
  pubsub.publish(rwDeckTopic(oldId), sDeckUpdate);
  return oldId;
};

export const rwDeckMutation: IResolverObject<any, IContext, any> = {
  rwDeckCreate, rwDeckCreateFromCsv, rwDeckCreateFromRows, rwDeckEdit, rwDeckDelete,
};
