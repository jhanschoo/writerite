import { GraphQLResolveInfo } from 'graphql';
import { MergeInfo } from 'graphql-tools';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { rwCardQuery } from '../src/resolver/Query/RwCard.query';
import { rwCardMutation } from '../src/resolver/Mutation/RwCard.mutation';
import { rwCardSubscription } from '../src/resolver/Subscription/RwCard.subscription';
import { prisma, PDeck, PUser, PCard } from '../generated/prisma-client';
import { IRwContext } from '../src/types';
import { resolveField } from '../src/util';

const { rwCard, rwCardsOfDeck } = rwCardQuery;
const { rwCardCreate, rwCardEdit, rwCardDelete } = rwCardMutation;
const { rwCardsUpdatesOfDeck } = rwCardSubscription;

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
const PROMPT = 'prompt';
const FULL_ANSWER = 'fullAnswer';
const NEXT_PROMPT = 'prompt';
const NEXT_FULL_ANSWER = 'fullAnswer';
const OTHER_PROMPT = 'otherPrompt';
const OTHER_FULL_ANSWER = 'otherFullAnswer';
const NEW_PROMPT = 'newPrompt';
const NEW_FULL_ANSWER = 'newFullAnswer';

describe('RwCard resolvers', async () => {
  let USER: PUser;
  let OTHER_USER: PUser;
  let DECK: PDeck;
  let NEXT_DECK: PDeck;
  let OTHER_DECK: PDeck;
  let CARD: PCard;
  let NEXT_CARD: PCard;
  let OTHER_CARD: PCard;
  const commonBeforeEach = async () => {
    await prisma.deleteManyPCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
    USER = await prisma.createPUser({ email: EMAIL });
    OTHER_USER = await prisma.createPUser({ email: OTHER_EMAIL });
    DECK = await prisma.createPDeck({ name: NAME, owner: { connect: { id: USER.id } } });
    NEXT_DECK = await prisma.createPDeck({ name: NEXT_NAME, owner: { connect: { id: USER.id } } });
    OTHER_DECK = await prisma.createPDeck({ name: OTHER_NAME, owner: { connect: { id: OTHER_USER.id } } });
    CARD = await prisma.createPCard({
      prompt: PROMPT, fullAnswer: FULL_ANSWER, sortKey: PROMPT, deck: { connect: { id: DECK.id } },
    });
    NEXT_CARD = await prisma.createPCard({
      prompt: NEXT_PROMPT, fullAnswer: NEXT_FULL_ANSWER, sortKey: NEXT_PROMPT, deck: { connect: { id: NEXT_DECK.id } },
    });
    OTHER_CARD = await prisma.createPCard({
      prompt: OTHER_PROMPT, fullAnswer: OTHER_FULL_ANSWER, sortKey: OTHER_PROMPT, deck: { connect: { id: OTHER_DECK.id } },
    });
  };
  const commonAfterEach = async () => {
    await prisma.deleteManyPCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  };

  beforeEach(async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
    await prisma.deleteManyPCards({});
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
      expect(cardObj).toHaveProperty('prompt', PROMPT);
      expect(cardObj).toHaveProperty('fullAnswer', FULL_ANSWER);
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
        expect.objectContaining({ prompt: PROMPT, fullAnswer: FULL_ANSWER }),
      );
    });
    test('it should return null if no deck with said id exists', async () => {
      expect.assertions(1);
      const cardObjs = await rwCardsOfDeck(null, { deckId: '1234567' }, baseCtx, baseInfo);
      expect(cardObjs).toBeNull();
    });
  });

  describe('rwCardCreate', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwCardCreate(
        null, { prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER, deckId: DECK.id }, baseCtx, baseInfo,
      )).resolves.toBeNull();
    });
    test('it should save card if deck\'s owner is sub.id', async () => {
      expect.assertions(7);
      const cardObj = await rwCardCreate(
        null,
        { prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER, deckId: DECK.id },
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
      expect(cardObj).toHaveProperty('prompt', NEW_PROMPT);
      expect(cardObj).toHaveProperty('fullAnswer', NEW_FULL_ANSWER);
      const savedCard = await prisma.pCard({
        id: await resolveField(cardObj.id),
      });
      expect(savedCard).toHaveProperty('id');
      expect(savedCard).toHaveProperty('prompt', NEW_PROMPT);
      expect(savedCard).toHaveProperty('fullAnswer', NEW_FULL_ANSWER);
    });
    test('it should return null if deck\'s owner is not sub.id', async () => {
      expect.assertions(2);
      expect(rwCardCreate(
        null,
        { prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER, deckId: OTHER_DECK.id },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
      const otherCards = await prisma.pCards({
        where: {
          deck: { id: OTHER_DECK.id },
        },
      });
      expect(otherCards).not.toContainEqual(
        expect.objectContaining({ prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER }),
      );
    });
  });

  describe('rwCardEdit', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwCardEdit(
        null, { id: CARD.id, prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER }, baseCtx, baseInfo,
      )).resolves.toBeNull();
    });
    test('it should update if id is supplied and deck\'s owner is sub.id', async () => {
      expect.assertions(6);
      const cardObj = await rwCardEdit(
        null,
        { id: CARD.id, prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      );
      expect(cardObj).toHaveProperty('id', CARD.id);
      expect(cardObj).toHaveProperty('prompt', NEW_PROMPT);
      expect(cardObj).toHaveProperty('fullAnswer', NEW_FULL_ANSWER);
      const savedCard = await prisma.pCard({ id: CARD.id });
      expect(savedCard).toHaveProperty('id', CARD.id);
      expect(savedCard).toHaveProperty('prompt', NEW_PROMPT);
      expect(savedCard).toHaveProperty('fullAnswer', NEW_FULL_ANSWER);
    });
    test('it should return null if deck\'s owner is not sub.id', async () => {
      expect.assertions(4);
      expect(rwCardEdit(
        null,
        { id: OTHER_CARD.id, prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER },
        {
          ...baseCtx,
          sub: {
            id: USER.id,
          },
        } as IRwContext,
        baseInfo,
      )).resolves.toBeNull();
      const cardObj = await prisma.pCard({ id: OTHER_CARD.id });
      expect(cardObj).toHaveProperty('id', OTHER_CARD.id);
      expect(cardObj).toHaveProperty('prompt', OTHER_PROMPT);
      expect(cardObj).toHaveProperty('fullAnswer', OTHER_FULL_ANSWER);
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
      expect(prisma.pCard({ id: await resolveField(cardId) })).resolves.toBeNull();
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

  describe('rwCardsUpdatesOfDeck', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no deck present', async () => {
      expect.assertions(1);
      const subscr = await rwCardsUpdatesOfDeck.subscribe(
        null, { deckId: '1234567' }, baseCtx, baseInfo,
      );
      expect(subscr).toBeNull();
    });
    test('it should return an AsyncIterator on deck present', async () => {
      expect.assertions(1);
      const subscr = await rwCardsUpdatesOfDeck.subscribe(
        null, { deckId: DECK.id }, baseCtx, baseInfo,
      );
      expect(subscr).toHaveProperty('next');
    });
    test('subscription on deck present is done if no new cards', async () => {
      expect.assertions(1);
      const subscr = await rwCardsUpdatesOfDeck.subscribe(
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
        const subscr = await rwCardsUpdatesOfDeck.subscribe(
          null, { deckId: DECK.id }, baseCtx, baseInfo,
        );
        const cardObj = await rwCardCreate(
          null,
          { deckId: DECK.id, prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER },
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
            expect(payload.new.prompt).toEqual(cardObj.prompt);
            expect(payload.new.fullAnswer).toEqual(cardObj.fullAnswer);
          }
          expect(newCard.done).toBe(false);
        }
      });
    test(
      `subscription on room does not reproduce message posted in
      room using rwRoomMessageCreate before subscription`,
      async () => {
        expect.assertions(1);
        await rwCardCreate(
          null,
          { deckId: DECK.id, prompt: NEW_PROMPT, fullAnswer: NEW_FULL_ANSWER },
          { ...baseCtx, sub: { id: USER.id } } as IRwContext,
          baseInfo,
        );
        const subscr = await rwCardsUpdatesOfDeck.subscribe(
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
