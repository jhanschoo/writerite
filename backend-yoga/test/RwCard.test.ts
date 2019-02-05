import { GraphQLResolveInfo } from 'graphql';
import { MergeInfo } from 'graphql-tools';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { rwCardQuery } from '../src/resolver/Query/RwCard.query';
import { rwCardMutation } from '../src/resolver/Mutation/RwCard.mutation';
import { rwCardSubscription } from '../src/resolver/Subscription/RwCard.subscription';
import { prisma, PDeck, PUser, PSimpleCard } from '../generated/prisma-client';
import { IRwContext } from '../src/types';
import { resolveField } from '../src/util';

const { rwCard, rwCardsOfDeck } = rwCardQuery;
const { rwCardSave, rwCardDelete } = rwCardMutation;
const { rwCardUpdatesOfDeck } = rwCardSubscription;

const redisClient = new Redis();
const pubsub = new RedisPubSub();
const baseCtx = { prisma, pubsub, redisClient } as IRwContext;
const baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };

const EMAIL = 'abc@xyz';
const OTHER_EMAIL = 'def@xyz';
const NEW_EMAIL = 'ghi@xyz';
const NAME = 'oldDeck';
const OTHER_NAME = 'otherDeck';
const NEXT_NAME = 'nextDeck';
const NEW_NAME = 'newDeck';
const FRONT = 'front';
const BACK = 'back';
const NEXT_FRONT = 'front';
const NEXT_BACK = 'back';
const OTHER_FRONT = 'otherFront';
const OTHER_BACK = 'otherBack';
const NEW_FRONT = 'newFront';
const NEW_BACK = 'newBack';

describe('RwCard resolvers', async () => {
  let USER: PUser;
  let OTHER_USER: PUser;
  let DECK: PDeck;
  let NEXT_DECK: PDeck;
  let OTHER_DECK: PDeck;
  let CARD: PSimpleCard;
  let NEXT_CARD: PSimpleCard;
  let OTHER_CARD: PSimpleCard;
  const commonBeforeEach = async () => {
    await prisma.deleteManyPSimpleCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
    USER = await prisma.createPUser({ email: EMAIL });
    OTHER_USER = await prisma.createPUser({ email: OTHER_EMAIL });
    DECK = await prisma.createPDeck({ name: NAME, owner: { connect: { id: USER.id } } });
    NEXT_DECK = await prisma.createPDeck({ name: NEXT_NAME, owner: { connect: { id: USER.id } } });
    OTHER_DECK = await prisma.createPDeck({ name: OTHER_NAME, owner: { connect: { id: OTHER_USER.id } } });
    CARD = await prisma.createPSimpleCard({
      front: FRONT, back: BACK, sortKey: FRONT, deck: { connect: { id: DECK.id } },
    });
    NEXT_CARD = await prisma.createPSimpleCard({
      front: NEXT_FRONT, back: NEXT_BACK, sortKey: NEXT_FRONT, deck: { connect: { id: NEXT_DECK.id } },
    });
    OTHER_CARD = await prisma.createPSimpleCard({
      front: OTHER_FRONT, back: OTHER_BACK, sortKey: OTHER_FRONT, deck: { connect: { id: OTHER_DECK.id } },
    });
  };
  const commonAfterEach = async () => {
    await prisma.deleteManyPSimpleCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  };

  beforeEach(async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
    await prisma.deleteManyPSimpleCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  });

  describe('rwCard', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return cards having specified id if deck exists', async () => {
      expect.assertions(2);
      const cardObj = await rwCard(
        null, { id: CARD.id }, baseCtx, baseInfo,
      );
      expect(cardObj).toHaveProperty('front', FRONT);
      expect(cardObj).toHaveProperty('back', BACK);
    });
    test('it should return null if no card with said id exists', async () => {
      expect.assertions(1);
      const cardObjs = await rwCard(
        null, { id: '1234567' }, baseCtx, baseInfo,
      );
      expect(cardObjs).toBeNull();
    });
  });

  describe('rwCardsOfDeck', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return cards from deck containing specified id if deck exists', async () => {
      expect.assertions(1);
      const cardObjs = await rwCardsOfDeck(
        null, { deckId: DECK.id }, baseCtx, baseInfo,
      );
      expect(cardObjs).toContainEqual(
        expect.objectContaining({ front: FRONT, back: BACK }),
      );
    });
    test('it should return null if no deck with said id exists', async () => {
      expect.assertions(1);
      const cardObjs = await rwCardsOfDeck(null, { deckId: '1234567' }, baseCtx, baseInfo);
      expect(cardObjs).toBeNull();
    });
  });

  describe('rwCardSave', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwCardSave(
        null, { front: NEW_FRONT, back: NEW_BACK, deckId: DECK.id }, baseCtx, baseInfo,
      )).resolves.toBeNull();
    });
    test('it should save card if id not supplied and deck\'s owner is sub.id', async () => {
      expect.assertions(7);
      const cardObj = await rwCardSave(
        null,
        { front: NEW_FRONT, back: NEW_BACK, deckId: DECK.id },
        {
          ...baseCtx,
          sub: { id: USER.id },
        } as IRwContext,
        baseInfo,
      );
      expect(cardObj).toBeTruthy();
      if (!cardObj) {
        throw new Error('`cardObj` could not be retrieved');
      }
      expect(cardObj).toHaveProperty('id');
      expect(cardObj).toHaveProperty('front', NEW_FRONT);
      expect(cardObj).toHaveProperty('back', NEW_BACK);
      const savedCard = await prisma.pSimpleCard({
        id: await resolveField(cardObj.id),
      });
      expect(savedCard).toHaveProperty('id');
      expect(savedCard).toHaveProperty('front', NEW_FRONT);
      expect(savedCard).toHaveProperty('back', NEW_BACK);
    });
    test('it should return null if id not supplied and deck\'s owner is not sub.id', async () => {
      expect.assertions(2);
      expect(rwCardSave(
        null,
        { front: NEW_FRONT, back: NEW_BACK, deckId: OTHER_DECK.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
      const otherCards = await prisma.pSimpleCards({
        where: {
          deck: { id: OTHER_DECK.id },
        },
      });
      expect(otherCards).not.toContainEqual(
        expect.objectContaining({ front: NEW_FRONT, back: NEW_BACK }),
      );
    });
    test('it should update if id is supplied and deck\'s owner is sub.id', async () => {
      expect.assertions(6);
      const cardObj = await rwCardSave(
        null,
        { id: CARD.id, front: NEW_FRONT, back: NEW_BACK, deckId: DECK.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      );
      expect(cardObj).toHaveProperty('id', CARD.id);
      expect(cardObj).toHaveProperty('front', NEW_FRONT);
      expect(cardObj).toHaveProperty('back', NEW_BACK);
      const savedCard = await prisma.pSimpleCard({ id: CARD.id });
      expect(savedCard).toHaveProperty('id', CARD.id);
      expect(savedCard).toHaveProperty('front', NEW_FRONT);
      expect(savedCard).toHaveProperty('back', NEW_BACK);
    });
    test('it should return null if id is supplied but deck is not correct', async () => {
      expect.assertions(4);
      expect(rwCardSave(
        null,
        { id: CARD.id, front: NEW_FRONT, back: NEW_BACK, deckId: NEXT_DECK.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
      const cardObj = await prisma.pSimpleCard({ id: CARD.id });
      expect(cardObj).toHaveProperty('id', CARD.id);
      expect(cardObj).toHaveProperty('front', FRONT);
      expect(cardObj).toHaveProperty('back', BACK);
    });
    test('it should return null if deck\'s owner is not sub.id', async () => {
      expect.assertions(4);
      expect(rwCardSave(
        null,
        { id: OTHER_CARD.id, front: NEW_FRONT, back: NEW_BACK, deckId: OTHER_DECK.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
      const cardObj = await prisma.pSimpleCard({ id: OTHER_CARD.id });
      expect(cardObj).toHaveProperty('id', OTHER_CARD.id);
      expect(cardObj).toHaveProperty('front', OTHER_FRONT);
      expect(cardObj).toHaveProperty('back', OTHER_BACK);
    });
  });

  describe('rwCardDelete', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwCardDelete(null, { id: CARD.id }, baseCtx, baseInfo)).resolves.toBeNull();
    });
    test('it should delete if deck\'s owner is sub.id', async () => {
      expect.assertions(2);
      const cardId = await rwCardDelete(
        null,
        { id: CARD.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      );
      expect(cardId).toBe(CARD.id);
      expect(prisma.pSimpleCard({ id: await resolveField(cardId) })).resolves.toBeNull();
    });
    test('it should not delete if deck\'s owner is not sub.id', async () => {
      expect.assertions(1);
      expect(rwCardDelete(
        null,
        { id: OTHER_CARD.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
    });
  });

  describe('rwCardUpdatesOfDeck', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no deck present', async () => {
      expect.assertions(1);
      const subscr = await rwCardUpdatesOfDeck.subscribe(
        null, { deckId: '1234567' }, baseCtx, baseInfo,
      );
      expect(subscr).toBeNull();
    });
    test('it should return an AsyncIterator on deck present', async () => {
      expect.assertions(1);
      const subscr = await rwCardUpdatesOfDeck.subscribe(
        null, { deckId: DECK.id }, baseCtx, baseInfo,
      );
      expect(subscr).toHaveProperty('next');
    });
    test('subscription on deck present is done if no new cards', async () => {
      expect.assertions(1);
      const subscr = await rwCardUpdatesOfDeck.subscribe(
        null, { deckId: DECK.id }, baseCtx, baseInfo,
      );
      expect(subscr).toBeTruthy();
      if (subscr) {
        subscr.next().then(() => {
          throw new Error();
        });
      }
      return await new Promise((res) => setTimeout(res, 500));
    });
    test(
      `subscription on room reproduces message posted in room using rwRoomMessageCreate since subscription`,
      async () => {
        expect.assertions(7);
        const subscr = await rwCardUpdatesOfDeck.subscribe(
          null, { deckId: DECK.id }, baseCtx, baseInfo,
        );
        const cardObj = await rwCardSave(
          null,
          { deckId: DECK.id, front: NEW_FRONT, back: NEW_BACK },
          { ...baseCtx, sub: { id: USER.id } } as IRwContext,
          baseInfo,
        );
        expect(cardObj).toBeTruthy();
        if (cardObj) {
          expect(subscr).toBeTruthy();
          if (!subscr) {
            throw new Error('`subscr` not obtained');
          }
          const newCard = await subscr.next();
          if (newCard.value && newCard.value) {
            const payload: any = newCard.value;
            expect(payload.mutation).toBe('CREATED');
            expect(payload.new.id).toEqual(cardObj.id);
            expect(payload.new.front).toEqual(cardObj.front);
            expect(payload.new.back).toEqual(cardObj.back);
          }
          expect(newCard.done).toBe(false);
        }
      });
    test(
      `subscription on room does not reproduce message posted in
      room using rwRoomMessageCreate before subscription`,
      async () => {
        expect.assertions(1);
        await rwCardSave(
          null,
          { deckId: DECK.id, front: NEW_FRONT, back: NEW_BACK },
          { ...baseCtx, sub: { id: USER.id } } as IRwContext,
          baseInfo,
        );
        const subscr = await rwCardUpdatesOfDeck.subscribe(
          null, { deckId: DECK.id }, baseCtx, baseInfo,
        );
        expect(subscr).toBeTruthy();
        if (subscr) {
          const nextResult = subscr.next();
          nextResult.then(() => {
            throw new Error();
          });
        }
        return await new Promise((res) => setTimeout(res, 500));
      });
  });
});
