import { GraphQLResolveInfo } from 'graphql';
import { MergeInfo } from 'graphql-tools';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

import { prisma, PRoom, PUser, PDeck } from '../generated/prisma-client';
import { IRwContext, ICurrentUser } from '../src/types';

import { rwRoomQuery } from '../src/resolver/Query/RwRoom.query';
import { rwRoomMutation } from '../src/resolver/Mutation/RwRoom.mutation';
import { rwRoomMessageMutation } from '../src/resolver/Mutation/RwRoomMessage.mutation';
import { rwRoomMessageSubscription } from '../src/resolver/Subscription/RwRoomMessage.subscription';

const redisClient = new Redis();
const pubsub = new RedisPubSub();
const baseCtx = { prisma, pubsub, redisClient } as IRwContext;
const baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };

const { rwRoom } = rwRoomQuery;
const { rwRoomCreate, rwRoomAddOccupant } = rwRoomMutation;
const { rwRoomMessageCreate } = rwRoomMessageMutation;
const { rwRoomMessagesUpdatesOfRoom } = rwRoomMessageSubscription;

const EMAIL = 'abc@xyz';
const OTHER_EMAIL = 'def@xyz';
const NEW_EMAIL = 'ghi@xyz';
const NEW_CONTENT = 'baz';
const DECK_NAME = 'd1';
const ROOM_NAME = 'r1';

describe('RwRoom resolvers', async () => {
  let USER: PUser;
  let OTHER_USER: PUser;
  let DECK: PDeck;
  let OTHER_DECK: PDeck;
  let ROOM: PRoom;
  let OTHER_ROOM: PRoom;
  const commonBeforeEach = async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
    USER = await prisma.createPUser({ email: EMAIL });
    OTHER_USER = await prisma.createPUser({ email: OTHER_EMAIL });
    DECK = await prisma.createPDeck({
      name: DECK_NAME,
      owner: { connect: { id: USER.id } },
    });
    OTHER_DECK = await prisma.createPDeck({
      name: DECK_NAME,
      owner: { connect: { id: USER.id } },
    });
    ROOM = await prisma.createPRoom({
      name: ROOM_NAME,
      owner: { connect: { id: USER.id } },
      occupants: {
        connect: { id: USER.id },
      },
    });
    OTHER_ROOM = await prisma.createPRoom({
      name: ROOM_NAME,
      owner: { connect: { id: OTHER_USER.id } },
    });
  };
  const commonAfterEach = async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
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

  describe('rwRoom', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no room present', async () => {
      expect.assertions(1);
      const roomObj = await rwRoom(null, { id: '1234567' }, baseCtx, baseInfo);
      expect(roomObj).toBeNull();
    });
    test('it should return room if it exists', async () => {
      expect.assertions(1);
      const roomObj = await rwRoom(null, { id: ROOM.id }, baseCtx, baseInfo);
      if (roomObj) {
        expect(roomObj.id).toBe(ROOM.id);
      }
    });
  });

  describe('rwRoomCreate', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      const roomObj = await rwRoomCreate(null, {}, baseCtx, baseInfo);
      expect(roomObj).toBeNull();
    });
    test('it creates a room once sub.id is present', async () => {
      expect.assertions(3);
      const roomObj = await rwRoomCreate(null, {}, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(roomObj).toHaveProperty('id');
      expect(roomObj).toHaveProperty('name');
      if (roomObj) {
        const ownerId = await prisma.pRoom({ id: roomObj.id }).owner().id();
        expect(ownerId).toBe(USER.id);
      }
    });
    test('it creates a room with given name', async () => {
      expect.assertions(3);
      const roomObj = await rwRoomCreate(null, { name: ROOM_NAME }, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(roomObj).toHaveProperty('id');
      expect(roomObj).toHaveProperty('name', ROOM_NAME);
      if (roomObj) {
        const ownerId = await prisma.pRoom({ id: roomObj.id }).owner().id();
        expect(ownerId).toBe(USER.id);
      }
    });
  });

  describe('rwRoomAddOccupant', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on neither room nor occupant present', async () => {
      expect.assertions(1);
      const roomObj = await rwRoomAddOccupant(
        null, { id: '1234567', occupantId: '1234567' }, baseCtx, baseInfo,
      );
      expect(roomObj).toBeNull();
    });
    test('it should return null on no room present', async () => {
      expect.assertions(1);
      const roomObj = await rwRoomAddOccupant(
        null, { id: '1234567', occupantId: USER.id }, baseCtx, baseInfo,
      );
      expect(roomObj).toBeNull();
    });
    test('it should return null on no occupant present', async () => {
      expect.assertions(1);
      const roomObj = await rwRoomAddOccupant(
        null, { id: ROOM.id, occupantId: '1234567' }, baseCtx, baseInfo,
      );
      expect(roomObj).toBeNull();
    });
    test('it makes no noticeable change when occupant is already in room and sub is owner', async () => {
      expect.assertions(3);
      const priorOccupants = await prisma.pRoom({ id: ROOM.id }).occupants();
      expect(priorOccupants).toContainEqual(expect.objectContaining({ id: USER.id }));
      const roomObj = await rwRoomAddOccupant(
        null, { id: ROOM.id, occupantId: USER.id }, { ...baseCtx, sub: {
          id: USER.id,
        } as ICurrentUser}, baseInfo,
      );
      expect(roomObj).toBeTruthy();
      if (roomObj) {
        const actualOccupants = (await prisma.pRoom({ id: roomObj.id }).occupants())
          .map((user) => user.id).sort();
        expect(actualOccupants).toEqual(priorOccupants.map((user) => user.id).sort());
      }
    });
    test('it adds occupant when occupant is not already in room and sub is owner', async () => {
      expect.assertions(3);
      const priorOccupants = await prisma.pRoom({ id: ROOM.id }).occupants();
      expect(priorOccupants).not.toContainEqual(
        expect.objectContaining({ id: OTHER_USER.id }),
      );
      const roomObj = await rwRoomAddOccupant(
        null, { id: ROOM.id, occupantId: OTHER_USER.id }, { ...baseCtx, sub: {
          id: USER.id,
        } as ICurrentUser}, baseInfo,
      );
      expect(roomObj).toBeTruthy();
      if (roomObj) {
        const actualIds = (await prisma.pRoom({ id: roomObj.id }).occupants())
          .map((user) => user.id).sort();
        const expectedIds = (priorOccupants.map((user) => user.id).concat([OTHER_USER.id])).sort();
        expect(actualIds).toEqual(expectedIds);
      }
    });
  });

  describe('rwRoomMessageCreate', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(2);
      const roomMessageObj1 = await rwRoomMessageCreate(
        null,
        { roomId: ROOM.id, content: NEW_CONTENT },
        baseCtx,
        baseInfo,
      );
      expect(roomMessageObj1).toBeNull();
      const roomMessageObj2 = await rwRoomMessageCreate(
        null,
        { roomId: ROOM.id, content: NEW_CONTENT },
        baseCtx,
        baseInfo,
      );
      expect(roomMessageObj2).toBeNull();
    });
    test('it should return null on no room present', async () => {
      expect.assertions(1);
      const roomMessageObj = await rwRoomMessageCreate(
        null,
        { roomId: '1234567', content: NEW_CONTENT },
        { ...baseCtx, sub: { id: USER.id, roles: ['user'] } } as IRwContext,
        baseInfo,
      );
      expect(roomMessageObj).toBeNull();
    });
    test('it should return null if sub.id is not an occupant', async () => {
      expect.assertions(1);
      const roomMessageObj = await rwRoomMessageCreate(
        null,
        { roomId: ROOM.id, content: NEW_CONTENT },
        { ...baseCtx, sub: { id: OTHER_USER.id, roles: ['user'] } } as IRwContext,
        baseInfo,
      );
      expect(roomMessageObj).toBeNull();
    });
    test('it should add message if sub.id is an occupant', async () => {
      expect.assertions(3);
      const roomMessageObj = await rwRoomMessageCreate(
        null,
        { roomId: ROOM.id, content: NEW_CONTENT },
        { ...baseCtx, sub: { id: USER.id, roles: ['user'] } } as IRwContext,
        baseInfo,
      );
      expect(roomMessageObj).toBeTruthy();
      const pRoom = await prisma.pRoom({ id: ROOM.id });
      expect(pRoom).toBeTruthy();
      if (!pRoom) {
        return null;
      }
      const roomMessages = await prisma.pRoom({ id: pRoom.id }).messages();
      expect(roomMessages).toContainEqual(
        expect.objectContaining({ content: NEW_CONTENT }),
      );
    });
    test('it should add message if sub.id is an acolyte', async () => {
      expect.assertions(4);
      const roomMessageObj = await rwRoomMessageCreate(
        null,
        { roomId: ROOM.id, content: NEW_CONTENT },
        { ...baseCtx, sub: { roles: ['acolyte'] } } as IRwContext,
        baseInfo,
      );
      expect(roomMessageObj).toBeTruthy();
      const pRoom = await prisma.pRoom({ id: ROOM.id });
      expect(pRoom).toBeTruthy();
      if (!pRoom) {
        return null;
      }
      const roomMessages = await prisma.pRoom({ id: pRoom.id }).messages();
      expect(roomMessages).toContainEqual(
        expect.objectContaining({ content: NEW_CONTENT }),
      );
      expect(await roomMessageObj.sender()).toBeNull();
    });
  });

  describe('rwRoomMessagesUpdatesOfRoom', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no room present', async () => {
      expect.assertions(1);
      const subscr = await rwRoomMessagesUpdatesOfRoom.subscribe(
        null, { roomId: '1234567' }, baseCtx, baseInfo,
      );
      expect(subscr).toBeNull();
    });
    test('it should return an AsyncIterator on room present', async () => {
      expect.assertions(1);
      const subscr = await rwRoomMessagesUpdatesOfRoom.subscribe(
        null, { roomId: ROOM.id }, baseCtx, baseInfo,
      );
      expect(subscr).toHaveProperty('next');
    });
    test('subscription on room present is done if no new messages', async () => {
      expect.assertions(1);
      const subscr = await rwRoomMessagesUpdatesOfRoom.subscribe(
        null, { roomId: ROOM.id }, baseCtx, baseInfo,
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
      `subscription on room reproduces message posted in room using
      rwRoomMessageCreate since subscription`,
      async () => {
        expect.assertions(6);
        const subscr = await rwRoomMessagesUpdatesOfRoom.subscribe(
          null, { roomId: ROOM.id }, baseCtx, baseInfo,
        );
        const roomMessageObj = await rwRoomMessageCreate(
          null,
          { roomId: ROOM.id, content: NEW_CONTENT },
          { ...baseCtx, sub: { id: USER.id, roles: ['user'] } } as IRwContext,
          baseInfo,
        );
        expect(roomMessageObj).toBeTruthy();
        if (roomMessageObj) {
          expect(subscr).toBeTruthy();
          if (!subscr) {
            throw new Error('`subscr` not obtained');
          }
          const newMessage = await subscr.next();
          if (newMessage.value) {
            const payload: any = newMessage.value;
            expect(payload.mutation).toBe('CREATED');
            expect(payload.new.id).toEqual(roomMessageObj.id);
            expect(payload.new.content).toEqual(roomMessageObj.content);
          }
          expect(newMessage.done).toBe(false);
        }
      });
    test(
      `subscription on room does not reproduce message posted in
      room using rwRoomMessageCreate before subscription`,
      async () => {
        expect.assertions(1);
        await rwRoomMessageCreate(
          null,
          { roomId: ROOM.id, content: NEW_CONTENT },
          { ...baseCtx, sub: { id: USER.id, roles: ['user'] } } as IRwContext,
          baseInfo,
        );
        const subscr = await rwRoomMessagesUpdatesOfRoom.subscribe(
          null, { roomId: ROOM.id }, baseCtx, baseInfo,
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
