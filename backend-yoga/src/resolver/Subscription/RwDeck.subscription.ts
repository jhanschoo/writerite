import { IFieldResolver } from 'apollo-server-koa';

import { IContext, IUpdate } from '../../types';

import { updateMapFactory } from '../../util';
import { ISDeck, RwDeck } from '../../model/RwDeck';

export function rwOwnDecksTopicFromOwner(id: string) {
  return `deck:owner:${id}`;
}

export function rwDeckTopic(id: string) {
  return `deck:id:${id}`;
}

const rwOwnDecksUpdatesSubscribe: IFieldResolver<any, IContext, any> = (
  _parent, _args, { sub, pubsub },
): AsyncIterator<IUpdate<ISDeck>> | null => {
  if (!sub) {
    return null;
  }
  return pubsub.asyncIterator<IUpdate<ISDeck>>(
    rwOwnDecksTopicFromOwner(sub.id),
  );
};

const rwDeckUpdatesSubscribe: IFieldResolver<any, IContext, { id: string }> = (
  _parent, { id }, { pubsub },
): AsyncIterator<IUpdate<ISDeck>> | null => {
  return pubsub.asyncIterator<IUpdate<ISDeck>>(
    rwDeckTopic(id),
  );
};

export const rwDeckSubscription = {
  rwOwnDecksUpdates: {
    resolve: updateMapFactory(RwDeck.fromSDeck),
    subscribe: rwOwnDecksUpdatesSubscribe,
  },
  rwDeckUpdates: {
    resolve: updateMapFactory(RwDeck.fromSDeck),
    subscribe: rwDeckUpdatesSubscribe,
  },
};
