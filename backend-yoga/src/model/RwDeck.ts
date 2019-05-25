import { PDeck, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwCard, RwCard } from './RwCard';
import { IRwUser, RwUser } from './RwUser';

export interface ISDeck {
  id: string;
  name: string;
  nameLang: string;
  promptLang: string;
  answerLang: string;
}

export interface IRwDeck extends ISDeck {
  id: string;
  name: string;
  nameLang: string;
  promptLang: string;
  answerLang: string;
  owner: AFunResTo<IRwUser>;
  cards: AFunResTo<IRwCard[]>;
}

export interface IRwDeckCreateParams {
  name?: string;
  nameLang?: string;
  promptLang?: string;
  answerLang?: string;
  userId: string;
}

export interface IRwDeckEditParams {
  id: string;
  name?: string;
  nameLang?: string;
  promptLang?: string;
  answerLang?: string;
}

// tslint:disable-next-line: variable-name
export const SDeck = {
  fromPDeck: (pDeck: PDeck): ISDeck => pDeck,
  get: async (prisma: Prisma, id: string): Promise<ISDeck | null> => {
    const pDeck = await prisma.pDeck({ id });
    return pDeck && SDeck.fromPDeck(pDeck);
  },
  getFromUserId: async (prisma: Prisma, userId: string): Promise<ISDeck[] | null> => {
    if (!await prisma.$exists.pUser({ id: userId })) {
      return null;
    }
    const pDecks = await prisma.pDecks({
      where: { owner: { id: userId } },
      orderBy: 'name_ASC',
    });
    return pDecks.map(SDeck.fromPDeck);
  },
  create: async (prisma: Prisma, {
    name, nameLang, promptLang, answerLang, userId,
  }: IRwDeckCreateParams): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.createPDeck({
      name: name || '',
      nameLang: nameLang || '',
      promptLang: promptLang || '',
      answerLang: answerLang || '',
      owner: { connect: { id: userId } },
    }));
  },
  edit: async (prisma: Prisma, {
    id, name, nameLang, promptLang, answerLang,
  }: IRwDeckEditParams): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        name: name || '',
        nameLang: nameLang || '',
        promptLang: promptLang || '',
        answerLang: answerLang || '',
      },
      where: { id },
    }));
  },
  delete: async (prisma: Prisma, id: string): Promise<string> => {
    const pDeck = await prisma.deletePDeck({ id });
    return pDeck.id;
  },
};

// tslint:disable-next-line: variable-name
export const RwDeck = {
  fromSDeck: (prisma: Prisma, sDeck: ISDeck): IRwDeck => ({
    ...sDeck,
    owner: async () => RwUser.fromPUser(
      prisma,
      await prisma.pDeck({ id: sDeck.id }).owner(),
    ),
    cards: async () => (
      await prisma.pDeck({ id: sDeck.id }).cards()
    ).map((pCard) => RwCard.fromPCard(prisma, pCard)),
  }),
  fromPDeck: (prisma: Prisma, pDeck: PDeck): IRwDeck => RwDeck.fromSDeck(
    prisma, SDeck.fromPDeck(pDeck),
  ),
  get: async (prisma: Prisma, id: string): Promise<IRwDeck | null> => {
    const sDeck = await SDeck.get(prisma, id);
    return sDeck && RwDeck.fromSDeck(prisma, sDeck);
  },
  getFromUserId: async (prisma: Prisma, userId: string): Promise<IRwDeck[] | null> => {
    const sDecks = await SDeck.getFromUserId(prisma, userId);
    return sDecks && sDecks.map((sDeck) => RwDeck.fromSDeck(prisma, sDeck));
  },
  create: async (prisma: Prisma, params: IRwDeckCreateParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.create(prisma, params)),
  edit: async (prisma: Prisma, params: IRwDeckEditParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.edit(prisma, params)),
  delete: SDeck.delete,
};

// type assertions

const _SDeck: IModel<ISDeck> = SDeck;
const _RwDeck: IModel<IRwDeck> = RwDeck;
