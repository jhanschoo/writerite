import { IFieldResolver } from 'graphql-tools';

import { IRwContext } from '../../types';

import { IBakedRwDeck, pDeckToRwDeck } from '../RwDeck';
import { throwIfDevel, wrGuardPrismaNullError, wrAuthenticationError } from '../../util';

const rwDeck: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IBakedRwDeck | null> => {
  try {
    const pDeck = wrGuardPrismaNullError(await prisma.pDeck({ id }));
    return pDeckToRwDeck(pDeck, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwOwnDecks: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, context,
): Promise<IBakedRwDeck[] | null> => {
  try {
    console.log(context);
    const { prisma, sub } = context;
    if (!sub) {
      throw wrAuthenticationError();
    }
    const pDecks = await prisma.pDecks({
      where: {
        owner: {
          id: sub.id,
        },
      },
    });
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
  rwDeck, rwOwnDecks,
};
