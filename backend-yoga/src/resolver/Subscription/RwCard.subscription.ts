import { IFieldResolver } from 'graphql-tools';

import { IRwContext, IUpdate } from '../../types';

import { pCardToRwCard } from '../RwCard';
import { PSimpleCard } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel, wrNotFoundError } from '../../util';

export function rwCardsTopicFromRwDeck(id: string) {
  return `card:deck:${id}`;
}

const rwCardsUpdatesOfDeckSubscribe: IFieldResolver<any, IRwContext, {
  deckId: string,
}> = async (
  _parent, { deckId }, { prisma, pubsub },
): Promise<AsyncIterator<IUpdate<PSimpleCard>> | null> => {
  try {
    if (!await prisma.$exists.pDeck({ id: deckId })) {
      throw wrNotFoundError('deck');
    }
    return pubsub.asyncIterator<IUpdate<PSimpleCard>>(
      rwCardsTopicFromRwDeck(deckId),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwCardSubscription = {
  rwCardsUpdatesOfDeck: {
    resolve: updateMapFactory(pCardToRwCard),
    subscribe: rwCardsUpdatesOfDeckSubscribe,
  },
};
