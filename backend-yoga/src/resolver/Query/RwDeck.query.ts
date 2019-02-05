import { IFieldResolver } from 'graphql-tools';

import { IRwContext } from '../../types';

import { IBakedRwDeck, pDeckToRwDeck } from '../RwDeck';
import { throwIfDevel, wrGuardPrismaNullError } from '../../util';

const rwDeck: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IBakedRwDeck | null> => {
  try {
    const pDeck = await prisma.pDeck({ id });
    wrGuardPrismaNullError(pDeck);
    return pDeckToRwDeck(pDeck, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwDecks: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, { prisma, sub },
): Promise<IBakedRwDeck[] | null> => {
  try {
    const pDecks = await prisma.pDecks();
    if (!pDecks) {
      return null;
    }
    wrGuardPrismaNullError(pDecks);
    return pDecks.map((pDeck) => pDeckToRwDeck(pDeck, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwDeckQuery = {
  rwDeck, rwDecks,
};
