import { PCard, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwDeck, RwDeck } from './RwDeck';

export interface ISCard {
  id: string;
  prompt: string;
  fullAnswer: string;
  sortKey: string;
  editedAt: string;
  template: boolean;
}

export interface IRwCard extends ISCard {
  deck: AFunResTo<IRwDeck>;
}

export interface IRwCardCreateParams {
  prompt?: string;
  fullAnswer?: string;
  sortKey?: string;
  template?: boolean;
  deckId: string;
}

export interface IRwCardEditParams {
  id: string;
  prompt?: string;
  fullAnswer?: string;
  sortKey?: string;
  template?: boolean;
}

// tslint:disable-next-line: variable-name
export const SCard = {
  fromPCard: (pCard: PCard): ISCard => pCard,
  get: async (prisma: Prisma, id: string): Promise<ISCard | null> => {
    const pCard = await prisma.pCard({ id });
    return pCard && SCard.fromPCard(pCard);
  },
  getFromDeckId: async (prisma: Prisma, deckId: string): Promise<ISCard[] | null> => {
    if (!await prisma.$exists.pDeck({ id: deckId })) {
      return null;
    }
    const pCards = await prisma.pCards({
      where: { deck: { id: deckId } },
      orderBy: 'sortKey_ASC',
    });
    return pCards.map(SCard.fromPCard);
  },
  create: async (prisma: Prisma, {
    prompt, fullAnswer, sortKey, template, deckId,
  }: IRwCardCreateParams): Promise<ISCard> => {
    return SCard.fromPCard(await prisma.createPCard({
      prompt: prompt || '',
      fullAnswer: fullAnswer || '',
      sortKey: sortKey || prompt || '',
      editedAt: (new Date()).toISOString(),
      template: template || false,
      deck: { connect: { id: deckId } },
    }));
  },
  createMany: async (prisma: Prisma, multiplicity: number, {
    prompt, fullAnswer, sortKey, template, deckId,
  }: IRwCardCreateParams): Promise<ISCard[]> => {
    // no direct way to create multiple in the same transaction
    // and obtain a list of exactly the created cards
    const pCards: PCard[] = [];
    for (let i = 0; i < multiplicity; ++i) {
      const pCard = await prisma.createPCard({
        prompt: prompt || '',
        fullAnswer: fullAnswer || '',
        sortKey: sortKey || prompt || '',
        deck: { connect: { id: deckId } },
        editedAt: (new Date()).toISOString(),
        template: template || false,
      });
      pCards.push(pCard);
    }
    return pCards.map(SCard.fromPCard);
  },
  edit: async (prisma: Prisma, {
    id, prompt, fullAnswer, sortKey, template,
  }: IRwCardEditParams): Promise<ISCard> => {
    const pCard = await prisma.updatePCard({
      data: {
        prompt,
        fullAnswer,
        sortKey,
        template,
        editedAt: (new Date()).toISOString(),
      },
      where: { id },
    });
    return SCard.fromPCard(pCard);
  },
  delete: async (prisma: Prisma, id: string): Promise<string> => {
    const pCard = await prisma.deletePCard({ id });
    return pCard.id;
  },
};

// tslint:disable-next-line: variable-name
export const RwCard = {
  fromSCard: (prisma: Prisma, sCard: ISCard): IRwCard => ({
    ...sCard,
    deck: async (): Promise<IRwDeck> => {
      const pDecks = await prisma.pDecks({ where: { cards_some: { id: sCard.id } } });
      return RwDeck.fromPDeck(prisma, pDecks[0]);
    },
  }),
  fromPCard: (prisma: Prisma, pCard: PCard): IRwCard => RwCard.fromSCard(
    prisma, SCard.fromPCard(pCard),
  ),
  get: async (prisma: Prisma, id: string): Promise<IRwCard | null> => {
    const sCard = await SCard.get(prisma, id);
    return sCard && RwCard.fromSCard(prisma, sCard);
  },
  getFromDeckId: async (prisma: Prisma, deckId: string): Promise<IRwCard[] | null> => {
    const sCards = await SCard.getFromDeckId(prisma, deckId);
    return sCards && sCards.map((sCard) => RwCard.fromSCard(prisma, sCard));
  },
  create: async (prisma: Prisma, params: IRwCardCreateParams) =>
    RwCard.fromSCard(prisma, await SCard.create(prisma, params)),
  createMany: async (prisma: Prisma, multiplicity: number, params: IRwCardCreateParams) =>
    (await SCard.createMany(prisma, multiplicity, params)).map(
      (sCard) => RwCard.fromSCard(prisma, sCard),
    ),
  edit: async (prisma: Prisma, params: IRwCardEditParams) =>
    RwCard.fromSCard(prisma, await SCard.edit(prisma, params)),
  delete: SCard.delete,
};

// type assertions

const _SCard: IModel<ISCard> = SCard;
const _RwCard: IModel<IRwCard> = RwCard;
