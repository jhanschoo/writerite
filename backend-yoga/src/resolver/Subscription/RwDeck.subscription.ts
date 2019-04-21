import { IFieldResolver } from 'graphql-tools';

import { IRwContext, IUpdate } from '../../types';

import { pDeckToRwDeck } from '../RwDeck';
import { PDeck } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel, wrAuthenticationError } from '../../util';

export function rwOwnDeckTopicFromOwner(id: string) {
  return `deck:owner:${id}`;
}

const rwOwnDeckUpdatesSubscribe: IFieldResolver<any, IRwContext, {}> = (
  _parent, _args, { sub, pubsub },
): AsyncIterator<IUpdate<PDeck>> | null => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    return pubsub.asyncIterator<IUpdate<PDeck>>(
      rwOwnDeckTopicFromOwner(sub.id),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckSubscription = {
  rwOwnDeckUpdates: {
    resolve: updateMapFactory(pDeckToRwDeck),
    subscribe: rwOwnDeckUpdatesSubscribe,
  },
};
