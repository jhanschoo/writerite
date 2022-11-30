import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import {
  enumType,
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
  subscriptionField,
} from 'nexus';
import { MESSAGE_UPDATES_BY_ROOM_SLUG_TOPIC } from '../service/message';
import { Message as BackingMessage } from '../types/backingTypes';
import { userLacksPermissionsErrorFactory } from '../error';
import { guardValidUser } from '../service/authorization/guardValidUser';
import { jsonArg } from './scalarUtil';

const MESSAGE_CREATE_KEY = 'messageCreate';

const MESSAGE_UPDATE_KEYS = [MESSAGE_CREATE_KEY] as const;

export interface MessageUpdatePublishArgs {
  [MESSAGE_UPDATES_BY_ROOM_SLUG_TOPIC]: [slug: string, payload: MessageUpdateBase];
}

export interface MessageUpdateBase {
  operation: typeof MESSAGE_UPDATE_KEYS[number];
  value: BackingMessage;
}

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('roomId');
    t.id('senderId');
    t.nonNull.field('type', {
      type: 'MessageContentType',
    });
    t.nonNull.json('content');
    t.nonNull.dateTime('createdAt');

    t.field('sender', {
      type: 'User',
      async resolve({ senderId }, _args, { prisma }) {
        if (senderId === null) {
          return null;
        }
        const room = await prisma.user.findUnique({ where: { id: senderId } });
        if (room === null) {
          throw new Error(`Could not find user with id ${senderId}`);
        }
        return room;
      },
    });
    t.nonNull.field('room', {
      type: 'Room',
      async resolve({ roomId }, _args, { prisma }) {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (room === null) {
          throw new Error(`Could not find room with id ${roomId}`);
        }
        return room;
      },
    });
  },
});

export const MessageContentType = enumType({
  name: 'MessageContentType',
  members: ['TEXT', 'CONFIG', 'ROUND_START', 'ROUND_WIN', 'ROUND_SCORE', 'CONTEST_SCORE'],
});

export const MessageQuery = queryField('message', {
  type: nonNull('Message'),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { prisma, sub }) => {
    const res = await prisma.message.findFirst({
      where: { id, room: { occupants: { some: { occupantId: sub.id } } } },
    });
    if (res === null) {
      throw userLacksPermissionsErrorFactory();
    }
    return res;
  }),
});

export const MessagesOfRoomQuery = queryField('messagesOfRoom', {
  type: nonNull(list(nonNull('Message'))),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { prisma, sub }) =>
    prisma.message.findMany({
      where: { room: { id, occupants: { some: { occupantId: sub.id } } } },
    })
  ),
});

export const MessageCreateMutation = mutationField(MESSAGE_CREATE_KEY, {
  type: nonNull('Message'),
  args: {
    slug: nonNull(stringArg()),
    type: nonNull('MessageContentType'),
    content: jsonArg(),
  },
  resolve: guardValidUser(async (_source, { slug, type, content }, { prisma, pubsub, sub }) => {
    if (!sub.occupyingActiveRoomSlugs[slug]) {
      throw userLacksPermissionsErrorFactory();
    }
    const now = new Date();
    const message: BackingMessage = {
      id: nanoid(),
      roomId: sub.occupyingActiveRoomSlugs[slug],
      senderId: sub.id,
      type,
      content: content as Prisma.JsonValue,
      createdAt: now,
      updatedAt: now,
    };
    pubsub.publish(MESSAGE_UPDATES_BY_ROOM_SLUG_TOPIC, slug, {
      operation: MESSAGE_CREATE_KEY,
      value: message,
    });
    try {
      const pMessage = await prisma.message.create({
        data: {
          ...message,
          content: (content as Prisma.JsonValue) ?? Prisma.JsonNull,
        },
      });
      return pMessage;
    } catch (e) {
      // log inconsistency that users received a message but it was not persisted
      // eslint-disable-next-line no-console
      console.error(
        `${MESSAGE_CREATE_KEY}: A message with id ${message.id} was published but not persisted:`
      );
      // eslint-disable-next-line no-console
      console.error(`${MESSAGE_CREATE_KEY}:`, e);
      throw e;
    }
  }),
  description: `@triggersSubscriptions(
    signatures: ["messagesOfRoomUpdates"]
  )`,
});

export const MessageUpdateOperation = enumType({
  name: 'MessageUpdateOperation',
  members: MESSAGE_UPDATE_KEYS,
});

export const MessageUpdate = objectType({
  name: 'MessageUpdate',
  definition(t) {
    t.nonNull.field('operation', {
      type: 'MessageUpdateOperation',
    });
    t.nonNull.field('value', {
      type: 'Message',
    });
  },
});

export const MessageUpdatesByRoomSlugSubscription = subscriptionField('messageUpdatesByRoomSlug', {
  type: nonNull('MessageUpdate'),
  args: {
    slug: nonNull(stringArg()),
  },
  subscribe: guardValidUser((_parent, { slug }, { pubsub, sub }, _info) => {
    if (!sub.occupyingActiveRoomSlugs[slug]) {
      throw userLacksPermissionsErrorFactory();
    }
    return pubsub.subscribe(MESSAGE_UPDATES_BY_ROOM_SLUG_TOPIC, slug);
  }),
  resolve(parent: MessageUpdateBase) {
    return parent;
  },
});
