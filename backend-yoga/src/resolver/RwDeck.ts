import { PDeck, Prisma, PSimpleCard } from '../../generated/prisma-client';
import { ResTo, AFunResTo } from '../types';
import { fieldGetter, wrGuardPrismaNullError } from '../util';

import { IRwUser, IBakedRwUser, pUserToRwUser } from './RwUser';
import { IRwCard, IBakedRwCard, pCardToRwCard } from './RwCard';

export interface IRwDeck {
  id: ResTo<string>;
  name: ResTo<string>;
  owner: ResTo<IRwUser>;
  cards: ResTo<IRwCard[]>;
}

// tslint:disable-next-line: variable-name
export const RwDeck: ResTo<IRwDeck> = {
  id: fieldGetter('id'),
  name: fieldGetter('name'),
  owner: fieldGetter('owner'),
  cards: fieldGetter('cards'),
};

export interface IBakedRwDeck extends IRwDeck {
  id: string;
  name: string;
  owner: AFunResTo<IBakedRwUser>;
  cards: AFunResTo<IBakedRwCard[]>;
}

export function pDeckToRwDeck(pDeck: PDeck, prisma: Prisma): IBakedRwDeck {
  return {
    id: pDeck.id,
    name: pDeck.name,
    owner: async () => pUserToRwUser(
      wrGuardPrismaNullError(await prisma.pDeck({ id: pDeck.id }).owner()),
      prisma,
    ),
    cards: async () => (
      wrGuardPrismaNullError<PSimpleCard[]>(await prisma.pDeck({ id: pDeck.id }).cards())
    ).map((pCard) => pCardToRwCard(pCard, prisma)),
  };
}
