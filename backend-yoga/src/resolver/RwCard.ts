import { Prisma, PCard } from '../../generated/prisma-client';
import { ResTo, AFunResTo } from '../types';
import { fieldGetter, wrGuardPrismaNullError } from '../util';

import { IRwDeck, IBakedRwDeck, pDeckToRwDeck } from './RwDeck';

export interface IRwCard {
  id: ResTo<string>;
  prompt: ResTo<string>;
  fullAnswer: ResTo<string>;
  sortKey: ResTo<string>;
  deck: ResTo<IRwDeck>;
  editedAt: ResTo<string>;
  template: ResTo<boolean>;
}

// tslint:disable-next-line: variable-name
export const RwCard: IRwCard = {
  id: fieldGetter<string>('id'),
  prompt: fieldGetter<string>('prompt'),
  fullAnswer: fieldGetter<string>('fullAnswer'),
  sortKey: fieldGetter<string>('sortKey'),
  deck: fieldGetter<IRwDeck>('deck'),
  editedAt: fieldGetter<string>('editedAt'),
  template: fieldGetter<boolean>('template'),
};

export interface IBakedRwCard extends IRwCard {
  id: string;
  prompt: string;
  fullAnswer: string;
  sortKey: string;
  deck: AFunResTo<IBakedRwDeck>;
  editedAt: string;
  template: boolean;
}

// Relation resolver
export function pCardToRwCard(pCard: PCard, prisma: Prisma): IBakedRwCard {
  return {
    id: pCard.id,
    prompt: pCard.prompt,
    fullAnswer: pCard.fullAnswer,
    sortKey: pCard.sortKey,
    deck: async () => {
      return pDeckToRwDeck(
        wrGuardPrismaNullError(await prisma.pCard({ id: pCard.id }).deck()),
        prisma,
      );
    },
    editedAt: pCard.editedAt,
    template: pCard.template,
  };
}
