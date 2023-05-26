import { decodeGlobalID, encodeGlobalID } from '@pothos/plugin-relay';
import { Message as PMessage, Prisma } from 'database';
import { nanoid } from 'nanoid';

import { builder } from '../builder';
import { MESSAGE_UPDATES_BY_ROOMID_TOPIC } from '../service/message';

export enum MessageUpdateOperations {
  MESSAGE_CREATE = 'messageCreate',
}

export interface MessageUpdateShape {
  operation: MessageUpdateOperations;
  value: PMessage;
}

export interface MessageUpdatePublishArgs {
  [MESSAGE_UPDATES_BY_ROOMID_TOPIC]: [
    slug: string,
    payload: MessageUpdateShape
  ];
}

builder.enumType(MessageUpdateOperations, {
  name: 'MessageUpdateOperations',
  description: 'Names identifying operations that trigger message updates.',
});

export enum MessageContentType {
  TEXT = 'TEXT',
  CONFIG = 'CONFIG',
  ROUND_START = 'ROUND_START',
  ROUND_WIN = 'ROUND_WIN',
  ROUND_SCORE = 'ROUND_SCORE',
  CONTEST_SCORE = 'CONTEST_SCORE',
}

builder.enumType(MessageContentType, {
  name: 'MessageContentType',
});

/**
 * A message sent by a user in a room. We do not support querying for relations on messages.
 */
export const Message = builder.prismaNode('Message', {
  id: { field: 'id' },
  fields: (t) => ({
    // ID's if revealed, need to be converted to global IDs
    // roomId: t.exposeID("roomId"),
    senderId: t.field({
      type: 'ID',
      nullable: true,
      description:
        "The client should consider transforming the message to include a sender: { id: <id>, name: <name> } field for normalization",
      resolve: ({ senderId }) => senderId ? encodeGlobalID('User', senderId) : null,
    }),
    senderBareId: t.field({
      type: 'ID',
      nullable: true,
      description:
        "The client should consider transforming the message to include a sender: { id: <id>, name: <name> } field for normalization",
      resolve: ({ senderId }) => senderId,
    }),
    type: t.field({
      type: MessageContentType,
      resolve: ({ type }) => type as MessageContentType,
    }),
    content: t.field({
      type: 'JSONObject',
      nullable: true,
      resolve: ({ content }) => content as Prisma.JsonObject | null,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    sender: t.relation('sender'),
  }),
});

builder.mutationFields((t) => ({
  sendTextMessage: t.withAuth({ authenticated: true }).prismaField({
    type: Message,
    args: {
      roomId: t.arg.id({ required: true }),
      textContent: t.arg.string({ required: true }),
    },
    authScopes: (_root, { roomId }) => ({
      authenticated: true,
      inRoomId: roomId,
    }),
    resolve: async (
      query,
      _root,
      { roomId, textContent },
      { prisma, pubsub, sub }
    ) => {
      roomId = decodeGlobalID(roomId as string).id;
      const now = new Date();
      const message: PMessage & { content: { text: string } } = {
        id: nanoid(),
        roomId,
        senderId: sub.bareId,
        type: MessageContentType.TEXT,
        content: { text: textContent },
        createdAt: now,
        updatedAt: now,
      };
      pubsub.publish(MESSAGE_UPDATES_BY_ROOMID_TOPIC, roomId, {
        operation: MessageUpdateOperations.MESSAGE_CREATE,
        value: { ...message },
      });

      const res = await prisma.message.create({
        ...query,
        data: message,
      });

      return res;
    },
  }),
}));

export const MessageUpdate = builder
  .objectRef<MessageUpdateShape>('MessageUpdate')
  .implement({
    description: 'A message indicating an operation performed on a message.',
    fields: (t) => ({
      operation: t.field({
        type: MessageUpdateOperations,
        resolve: (root) => root.operation,
      }),
      value: t.field({
        type: Message,
        resolve: (root) => root.value,
      }),
    }),
  });

builder.subscriptionFields((t) => ({
  messageUpdatesByRoomId: t.field({
    type: MessageUpdate,
    args: {
      id: t.arg.id({ required: true }),
    },
    subscribe: (_root, { id }, { pubsub }) => {
      id = decodeGlobalID(id as string).id;
      return pubsub.subscribe(MESSAGE_UPDATES_BY_ROOMID_TOPIC, id);
    },
    resolve(parent: MessageUpdateShape) {
      return parent;
    },
  }),
}));
