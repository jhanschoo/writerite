import { Prisma, PSimpleCard } from '../../generated/prisma-client';
import { ResTo, AFunResTo } from '../types';
import { fieldGetter, wrGuardPrismaNullError } from '../util';

import { IRwDeck, IBakedRwDeck, pDeckToRwDeck } from './RwDeck';

export interface IRwCard {
  id: ResTo<string>;
  front: ResTo<string>;
  back: ResTo<string>;
  sortKey: ResTo<string>;
  deck: ResTo<IRwDeck>;
}

// tslint:disable-next-line: variable-name
export const RwCard: IRwCard = {
  id: fieldGetter<string>('id'),
  front: fieldGetter<string>('front'),
  back: fieldGetter<string>('back'),
  sortKey: fieldGetter<string>('sortKey'),
  deck: fieldGetter<IRwDeck>('deck'),
};

export interface IBakedRwCard extends IRwCard {
  id: string;
  front: string;
  back: string;
  sortKey: string;
  deck: AFunResTo<IBakedRwDeck>;
}

// Relation resolver
export function pCardToRwCard(pSimpleCard: PSimpleCard, prisma: Prisma): IBakedRwCard {
  return {
    id: pSimpleCard.id,
    front: pSimpleCard.front,
    back: pSimpleCard.back,
    sortKey: pSimpleCard.sortKey,
    deck: async () => {
      return pDeckToRwDeck(
        wrGuardPrismaNullError(await prisma.pSimpleCard({ id: pSimpleCard.id }).deck()),
        prisma,
      );
    },
  };
}
