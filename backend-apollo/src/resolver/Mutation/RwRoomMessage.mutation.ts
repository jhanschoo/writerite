import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { MutationType, IContext, Roles, ICreatedUpdate, IUpdatedUpdate } from '../../types';
import {
  rwRoomMessagesTopicFromRwRoom,
} from '../Subscription/RwRoomMessage.subscription';
import { rwAuthenticationError } from '../../util';
import { ISRoomMessage, IRwRoomMessage, RwRoomMessageContentType } from '../../model/RwRoomMessage';

const rwRoomMessageCreate: IFieldResolver<any, IContext, {
  roomId: string, content: string, contentType: RwRoomMessageContentType,
}> = async (
  _parent, { roomId, content, contentType }, { models, sub, prisma, pubsub, redisClient },
): Promise<IRwRoomMessage | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const isWright = sub.roles.includes(Roles.wright);
  if (!isWright && !await models.RwRoom.hasOccupant(prisma, {
    id: roomId, occupantId: sub.id,
  })) {
    return null;
  }
  // default message handling is to add to record and broadcast to bot and users
  const sRoomMessage = await models.SRoomMessage.create(prisma, {
    roomId,
    senderId: (isWright) ? undefined : sub.id,
    content,
    contentType,
  });
  const sRoomMessageUpdate: ICreatedUpdate<ISRoomMessage> = {
    mutation: MutationType.CREATED,
    new: sRoomMessage,
    oldId: null,
  };
  pubsub.publish(rwRoomMessagesTopicFromRwRoom(roomId), sRoomMessageUpdate);
  if (!isWright) {
    redisClient.publish(`writerite:room::${roomId}`, JSON.stringify({
      type: 'MESSAGE',
      senderId: sub.id,
      content,
    }));
  }
  return models.RwRoomMessage.fromSRoomMessage(prisma, sRoomMessage);
};

export const rwRoomMessageMutation: IResolverObject<any, IContext, any> = {
  rwRoomMessageCreate,
};
