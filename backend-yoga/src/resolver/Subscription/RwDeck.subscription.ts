import { IFieldResolver } from 'graphql-tools';

import { IRwContext, IUpdate } from '../../types';

import { pDeckToRwDeck } from '../RwDeck';
import { PDeck } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel } from '../../util';

export function rwDeckTopic() {
  return `deck`;
}

const rwDeckUpdatesSubscribe: IFieldResolver<any, IRwContext, {}> = (
  _parent, _args, { sub, pubsub },
): AsyncIterator<IUpdate<PDeck>> | null => {
  try {
    return pubsub.asyncIterator<IUpdate<PDeck>>(
      rwDeckTopic(),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckSubscription = {
  rwDeckUpdates: {
    resolve: updateMapFactory(pDeckToRwDeck),
    subscribe: rwDeckUpdatesSubscribe,
  },
};
