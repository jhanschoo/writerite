import { IFieldResolver } from 'apollo-server-koa';

import { IContext, IUpdate } from '../../types';

import { ISCard, RwCard } from '../../model/RwCard';
import { updateMapFactory } from '../../util';

export function rwCardsTopicFromRwDeck(id: string) {
  return `card:deck:${id}`;
}

const rwCardsUpdatesOfDeckSubscribe: IFieldResolver<any, IContext, {
  deckId: string,
}> = async (
  _parent, { deckId }, { prisma, pubsub },
): Promise<AsyncIterator<IUpdate<ISCard>> | null> => {
  if (!await prisma.$exists.pDeck({ id: deckId })) {
    return null;
  }
  return pubsub.asyncIterator<IUpdate<ISCard>>(
    rwCardsTopicFromRwDeck(deckId),
  );
};

export const rwCardSubscription = {
  rwCardsUpdatesOfDeck: {
    resolve: updateMapFactory(RwCard.fromSCard),
    subscribe: rwCardsUpdatesOfDeckSubscribe,
  },
};
