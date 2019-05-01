import { IFieldResolver } from 'graphql-tools';

import { pCardToRwCard, IBakedRwCard } from '../RwCard';

import { IRwContext } from '../../types';
import { throwIfDevel, wrGuardPrismaNullError } from '../../util';

// Query resolvers

const rwCard: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IBakedRwCard | null> => {
  try {
    const pSimpleCard = wrGuardPrismaNullError(await prisma.pSimpleCard({ id }));
    return pCardToRwCard(pSimpleCard, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwCardsOfDeck: IFieldResolver<any, IRwContext, { deckId: string }> = async (
  _parent,
  { deckId },
  { prisma },
): Promise<IBakedRwCard[] | null> => {
  try {
    if (!await prisma.$exists.pDeck({ id: deckId })) {
      return null;
    }
    const pCards = await prisma.pSimpleCards({
      where: { deck: { id: deckId } },
      orderBy: 'sortKey_ASC',
    });
    wrGuardPrismaNullError(pCards);
    return (pCards).map((pCard) => pCardToRwCard(pCard, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwCardQuery = {
  rwCard, rwCardsOfDeck,
};
