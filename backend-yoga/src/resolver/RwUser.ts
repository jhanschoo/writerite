import { Prisma, PUser, PDeck } from '../../generated/prisma-client';
import { ResTo, AFunResTo } from '../types';
import { fieldGetter, wrGuardPrismaNullError } from '../util';

import { IRwDeck, IBakedRwDeck, pDeckToRwDeck } from './RwDeck';

export interface IRwUser {
  id: ResTo<string>;
  email: ResTo<string>;
  roles: ResTo<string[]>;
  decks: ResTo<IRwDeck[]>;
}

export interface IBakedRwUser extends IRwUser {
  id: string;
  email: string;
  roles: string[];
  decks: AFunResTo<IBakedRwDeck[]>;
}

// tslint:disable-next-line: variable-name
export const RwUser: ResTo<IRwUser> = {
  id: fieldGetter('id'),
  email: fieldGetter('email'),
  roles: fieldGetter('roles'),
  decks: fieldGetter('decks'),
};

export function pUserToRwUser(pUser: PUser, prisma: Prisma): IBakedRwUser {
  return {
    id: pUser.id,
    email: pUser.email,
    roles: pUser.defaultRoles,
    decks: async () => (
      wrGuardPrismaNullError<PDeck[]>(await prisma.pUser({ id: pUser.id }).decks())
    ).map((pDeck) => pDeckToRwDeck(pDeck, prisma)),
  };
}
