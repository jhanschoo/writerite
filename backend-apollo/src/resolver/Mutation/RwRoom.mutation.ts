import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext, MutationType, ICreatedUpdate, IUpdatedUpdate } from '../../types';

import { rwRoomTopic } from '../Subscription/RwRoom.subscription';
import { rwAuthenticationError } from '../../util';
import { ISRoom, RwRoom, IRwRoom, IRoomConfig } from '../../model/RwRoom';

const rwRoomCreate: IFieldResolver<any, IContext, {
  config: string,
}> = async (_parent, { config }, { models, prisma, pubsub, sub, redisClient }): Promise<IRwRoom | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const {
    deckId,
  }: IRoomConfig = JSON.parse(config);
  if (!deckId) {
    return null;
  }
  const sRoom = await models.SRoom.create(prisma, { userId: sub.id, config });
  const pRoomUpdate: ICreatedUpdate<ISRoom> = {
    mutation: MutationType.CREATED,
    new: sRoom,
    oldId: null,
  };
  redisClient.publish('writerite:room:serving', `${sRoom.id}:${config}`);
  pubsub.publish(rwRoomTopic(sRoom.id), pRoomUpdate);
  return models.RwRoom.fromSRoom(prisma, sRoom);
};

const rwRoomAddOccupant: IFieldResolver<any, IContext, {
  id: string, occupantId: string,
}> = async (
  _parent: any, { id, occupantId }, { models, prisma, sub, pubsub },
): Promise<IRwRoom | null> => {
  if (!sub || !(sub.id === occupantId || await prisma.$exists.pRoom({
    id,
    owner: { id: occupantId },
  }))) {
    throw rwAuthenticationError();
  }
  const sRoom = await models.SRoom.addOccupant(prisma, { id, occupantId });
  if (!sRoom) {
    return sRoom;
  }
  const sRoomUpdate: IUpdatedUpdate<ISRoom> = {
    mutation: MutationType.UPDATED,
    new: sRoom,
    oldId: null,
  };
  pubsub.publish(rwRoomTopic(sRoom.id), sRoomUpdate);
  return RwRoom.fromSRoom(prisma, sRoom);
};

// TODO: access control: owner or self only
const rwRoomDeactivate: IFieldResolver<any, IContext, {
  id: string,
}> = async (
  _parent: any, { id }, { models, prisma, sub, pubsub },
): Promise<IRwRoom | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  if (!await prisma.$exists.pRoom({
    id,
    OR: [{ owner: { id: sub.id } }, { occupants_some: { id: sub.id } }],
  })) {
    return null;
  }
  const sRoom = await models.SRoom.deactivate(prisma, { id: sub.id });
  const sRoomUpdate: IUpdatedUpdate<ISRoom> = {
    mutation: MutationType.UPDATED,
    new: sRoom,
    oldId: null,
  };
  pubsub.publish(rwRoomTopic(sRoom.id), sRoomUpdate);
  return RwRoom.fromSRoom(prisma, sRoom);
};

export const rwRoomMutation: IResolverObject<any, IContext, any> = {
  rwRoomCreate, rwRoomAddOccupant, rwRoomDeactivate,
};
