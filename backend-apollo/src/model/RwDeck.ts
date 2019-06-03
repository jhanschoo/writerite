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

export interface IRwDeckCreateFromRecordsParams extends IRwDeckCreateParams {
  records: string[][];
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
  createFromRecords: async (prisma: Prisma, {
    name, nameLang, promptLang, answerLang, userId, records,
  }: IRwDeckCreateFromRecordsParams): Promise<ISDeck> => {
    const editedAt = (new Date()).toISOString();
    return await SDeck.fromPDeck(await prisma.createPDeck({
      name: name || '',
      nameLang: nameLang || '',
      promptLang: promptLang || '',
      answerLang: answerLang || '',
      owner: { connect: { id: userId } },
      cards: {
        create: records.map((record) => ({
          prompt: record[0],
          fullAnswer: record[1],
          sortKey: (record.length > 2) ? record[2] : record[0],
          editedAt,
          template: false,
        })),
      },
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
    owner: async () => {
      const pUsers = await prisma.pUsers({ where: { decks_some: { id: sDeck.id } } });
      return RwUser.fromPUser(
        prisma,
        pUsers[0],
      );
    },
    cards: async () => {
      const pCards = await prisma.pCards({ where: { deck: { id: sDeck.id } } });
      return pCards.map((pCard) => RwCard.fromPCard(prisma, pCard));
    },
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
  createFromRecords: async (prisma: Prisma, params: IRwDeckCreateFromRecordsParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.createFromRecords(prisma, params)),
  edit: async (prisma: Prisma, params: IRwDeckEditParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.edit(prisma, params)),
  delete: SDeck.delete,
};

// type assertions

const _SDeck: IModel<ISDeck> = SDeck;
const _RwDeck: IModel<IRwDeck> = RwDeck;
