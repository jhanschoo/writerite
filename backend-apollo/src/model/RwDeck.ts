import { PDeck, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwCard, RwCard } from './RwCard';
import { IRwUser, RwUser } from './RwUser';

export interface ISDeck {
  id: string;
  name: string;
  description: string;
  nameLang: string;
  promptLang: string;
  answerLang: string;
}

export interface IRwDeck extends ISDeck {
  owner: AFunResTo<IRwUser>;
  subdecks: AFunResTo<IRwDeck[]>;
  cards: AFunResTo<IRwCard[]>;
}

export interface IRwDeckCreateParams {
  name?: string;
  description?: string;
  nameLang?: string;
  promptLang?: string;
  answerLang?: string;
  userId: string;
}

export interface IRwDeckCreateFromRowsParams extends IRwDeckCreateParams {
  rows: string[][];
}

export interface IRwDeckEditParams {
  id: string;
  name?: string;
  description?: string;
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
    name, description, nameLang, promptLang, answerLang, userId,
  }: IRwDeckCreateParams): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.createPDeck({
      name: name || '',
      description: description || '',
      nameLang: nameLang || '',
      promptLang: promptLang || '',
      answerLang: answerLang || '',
      owner: { connect: { id: userId } },
    }));
  },
  createFromRows: async (prisma: Prisma, {
    name, description, nameLang, promptLang, answerLang, userId, rows,
  }: IRwDeckCreateFromRowsParams): Promise<ISDeck> => {
    const editedAt = (new Date()).toISOString();
    return SDeck.fromPDeck(await prisma.createPDeck({
      name: name || '',
      description: description || '',
      nameLang: nameLang || '',
      promptLang: promptLang || '',
      answerLang: answerLang || '',
      owner: { connect: { id: userId } },
      cards: {
        create: rows.map((row) => ({
          prompt: row[0] || '',
          fullAnswer: row[1] || '',
          sortKey: (row.length > 2 && row[2]) ? row[2] : row[0],
          answers: { set: row.slice(3).filter((answer) => answer !== '') },
          editedAt,
          template: false,
        })),
      },
    }));
  },
  edit: async (prisma: Prisma, {
    id, name, description, nameLang, promptLang, answerLang,
  }: IRwDeckEditParams): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        name,
        description,
        nameLang,
        promptLang,
        answerLang,
      },
      where: { id },
    }));
  },
  addSubdeck: async (prisma: Prisma, id: string, subdeckId: string): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        subdecks: { connect: { id: subdeckId } },
      },
      where: { id },
    }));
  },
  addSubdecks: async (prisma: Prisma, id: string, subdeckIds: string[]): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        subdecks: { connect: subdeckIds.map((subdeckId) => ({ id: subdeckId })) },
      },
      where: { id },
    }));
  },
  removeSubdeck: async (prisma: Prisma, id: string, subdeckId: string): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        subdecks: { disconnect: { id: subdeckId } },
      },
      where: { id },
    }));
  },
  removeSubdecks: async (prisma: Prisma, id: string, subdeckIds: string[]): Promise<ISDeck> => {
    return await SDeck.fromPDeck(await prisma.updatePDeck({
      data: {
        subdecks: { disconnect: subdeckIds.map((subdeckId) => ({ id: subdeckId })) },
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
    subdecks: async () => {
      // NOTE: fluent API is used instead of where constraints due to
      //   Prisma Client API limitation (i.e. no backrelations) https://github.com/prisma/prisma/pull/2515
      const pDecks = await prisma.pDeck({ id: sDeck.id }).subdecks();
      return pDecks.map((pDeck) => RwDeck.fromPDeck(prisma, pDeck));
    }
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
  createFromRows: async (prisma: Prisma, params: IRwDeckCreateFromRowsParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.createFromRows(prisma, params)),
  edit: async (prisma: Prisma, params: IRwDeckEditParams) =>
    RwDeck.fromSDeck(prisma, await SDeck.edit(prisma, params)),
  addSubdeck: async (prisma: Prisma, id: string, subdeckId: string) =>
    RwDeck.fromSDeck(prisma, await SDeck.addSubdeck(prisma, id, subdeckId)),
  addSubdecks: async (prisma: Prisma, id: string, subdeckIds: string[]) =>
    RwDeck.fromSDeck(prisma, await SDeck.addSubdecks(prisma, id, subdeckIds)),
  removeSubdeck: async (prisma: Prisma, id: string, subdeckId: string) =>
    RwDeck.fromSDeck(prisma, await SDeck.removeSubdeck(prisma, id, subdeckId)),
  removeSubdecks: async (prisma: Prisma, id: string, subdeckIds: string[]) =>
    RwDeck.fromSDeck(prisma, await SDeck.removeSubdecks(prisma, id, subdeckIds)),
  delete: SDeck.delete,
};

// type assertions

const _SDeck: IModel<ISDeck> = SDeck;
const _RwDeck: IModel<IRwDeck> = RwDeck;
