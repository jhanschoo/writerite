import { PUser, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwDeck, RwDeck } from './RwDeck';

export interface ISUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export interface IRwUser extends ISUser {
  decks: AFunResTo<IRwDeck[]>;
}

export interface IRwUserEditParams {
  id: string;
  name?: string;
}

// tslint:disable-next-line: variable-name
export const SUser = {
  fromPUser: (pUser: PUser): ISUser => pUser,
  get: async (prisma: Prisma, id: string): Promise<ISUser | null> => {
    const pUser = await prisma.pUser({ id });
    return pUser && SUser.fromPUser(pUser);
  },
  getAll: async (prisma: Prisma): Promise<ISUser[]> => {
    const pUsers = await prisma.pUsers({
      orderBy: 'email_ASC',
    });
    return pUsers.map(SUser.fromPUser);
  },
  edit: async (prisma: Prisma, {
    id, name,
  }: IRwUserEditParams): Promise<ISUser> => {
    const pUser = await prisma.updatePUser({
      data: {
        name,
      },
      where: { id },
    });
    return SUser.fromPUser(pUser);
  },
};

// tslint:disable-next-line: variable-name
export const RwUser = {
  fromSUser: (prisma: Prisma, sUser: ISUser): IRwUser => ({
    ...sUser,
    decks: async () => (
      await prisma.pUser({ id: sUser.id }).decks()
    ).map((pDeck) => RwDeck.fromPDeck(prisma, pDeck)),
  }),
  fromPUser: (prisma: Prisma, pUser: PUser): IRwUser => RwUser.fromSUser(
    prisma, SUser.fromPUser(pUser),
  ),
  get: async (prisma: Prisma, id: string): Promise<IRwUser | null> => {
    const sUser = await SUser.get(prisma, id);
    return sUser && RwUser.fromSUser(prisma, sUser);
  },
  getAll: async (prisma: Prisma): Promise<IRwUser[]> => {
    const sUsers = await SUser.getAll(prisma);
    return sUsers.map(
      (sUser) => RwUser.fromSUser(prisma, sUser),
    );
  },
  edit: async (prisma: Prisma, params: IRwUserEditParams): Promise<IRwUser> => {
    return RwUser.fromSUser(prisma, await SUser.edit(prisma, params));
  },
};

// type assertions

const _SUser: IModel<ISUser> = SUser;
const _RwUser: IModel<IRwUser> = RwUser;
