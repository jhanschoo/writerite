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
  // NOTE: most special cases should return. Some special cases will
  //   be processed using default behavior outside the switch construct.
  //   No case should fall-through.
  switch (contentType) {
    case RwRoomMessageContentType.CONFIG:
      if (!isWright) {
        const pOwner = await prisma.pUsers({ where: { ownerOfRoom_some: { id: roomId } } });
        if (pOwner.length !== 1 || pOwner[0].id !== sub.id) {
          return null;
        }
        const pConfigMessages = await prisma.pRoomMessages({
          where: { room: { id: roomId }, contentType: 'CONFIG' },
        });
        for (const { id } of pConfigMessages) {
          const pConfigMessage = await prisma.updatePRoomMessage({
            where: { id }, data: { content },
          });
          // tslint:disable-next-line: no-shadowed-variable
          const sRoomMessage = await models.SRoomMessage.fromPRoomMessage(pConfigMessage);
          // tslint:disable-next-line: no-shadowed-variable
          const sRoomMessageUpdate: IUpdatedUpdate<ISRoomMessage> = {
            mutation: MutationType.UPDATED,
            new: sRoomMessage,
            oldId: null,
          };
          pubsub.publish(rwRoomMessagesTopicFromRwRoom(roomId), sRoomMessageUpdate);
        }
        if (pConfigMessages.length > 0) {
          redisClient.publish(`writerite:room::${roomId}`, `CONFIG:${sub.id}:${content}`);
        }
        return null;
      }
      break;
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
    redisClient.publish(`writerite:room::${roomId}`, `DEFAULT:${sub.id}:${content}`);
  }
  return models.RwRoomMessage.fromSRoomMessage(prisma, sRoomMessage);
};

export const rwRoomMessageMutation: IResolverObject<any, IContext, any> = {
  rwRoomMessageCreate,
};
