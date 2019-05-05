import { IFieldResolver } from 'graphql-tools';

import { IRwContext, IUpdate } from '../../types';

import { pDeckToRwDeck } from '../RwDeck';
import { PDeck } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel, wrAuthenticationError } from '../../util';

export function rwOwnDecksTopicFromOwner(id: string) {
  return `deck:owner:${id}`;
}

export function rwDeckTopic(id: string) {
  return `deck:id:${id}`;
}

const rwOwnDecksUpdatesSubscribe: IFieldResolver<any, IRwContext, {}> = (
  _parent, _args, { sub, pubsub },
): AsyncIterator<IUpdate<PDeck>> | null => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    return pubsub.asyncIterator<IUpdate<PDeck>>(
      rwOwnDecksTopicFromOwner(sub.id),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwDeckUpdatesSubscribe: IFieldResolver<any, IRwContext, { id: string }> = (
  _parent, { id }, { sub, pubsub },
): AsyncIterator<IUpdate<PDeck>> | null => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    return pubsub.asyncIterator<IUpdate<PDeck>>(
      rwDeckTopic(id),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckSubscription = {
  rwOwnDecksUpdates: {
    resolve: updateMapFactory(pDeckToRwDeck),
    subscribe: rwOwnDecksUpdatesSubscribe,
  },
  rwDeckUpdates: {
    resolve: updateMapFactory(pDeckToRwDeck),
    subscribe: rwDeckUpdatesSubscribe,
  },
};
