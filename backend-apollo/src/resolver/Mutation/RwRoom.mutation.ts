import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext, ICreatedUpdate, IUpdatedUpdate } from '../../types';

import { rwRoomTopic } from '../Subscription/RwRoom.subscription';
import { rwAuthenticationError } from '../../util';
import { ISRoom, IRwRoom, IRoomConfig } from '../../model/RwRoom';

const rwRoomCreate: IFieldResolver<any, IContext, {
  config: IRoomConfig,
}> = async (_parent, { config }, { models, prisma, pubsub, sub, redisClient }): Promise<IRwRoom | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const {
    deckId,
    roundLength,
  } = config;
  // additional validation
  if (!deckId || (roundLength && roundLength < 0)) {
    return null;
  }
  const sRoom = await models.SRoom.create(prisma, { userId: sub.id, config });
  const pRoomUpdate: ICreatedUpdate<ISRoom> = { created: sRoom };
  redisClient.publish('writerite:room:serving', `${sRoom.id}:${JSON.stringify(config)}`);
  pubsub.publish(rwRoomTopic(sRoom.id), pRoomUpdate);
  return models.RwRoom.fromSRoom(prisma, sRoom);
};

const rwRoomUpdateConfig: IFieldResolver<any, IContext, {
  id: string, config: IRoomConfig,
}> = async (
  _parent: any, { id, config }, { models, prisma, sub, pubsub, redisClient },
): Promise<IRwRoom | null> => {
  if (!sub || !await prisma.$exists.pRoom({
    id, owner: { id: sub.id },
  })) {
    throw rwAuthenticationError();
  }
  const { deckId, roundLength } = config;
  // additional validation
  if (!deckId || (roundLength && roundLength < 0)) {
    return null;
  }
  const sRoom = await models.SRoom.updateConfig(prisma, { id, config });
  if (!sRoom) {
    return sRoom;
  }
  const sRoomUpdate: IUpdatedUpdate<ISRoom> = { updated: sRoom };
  redisClient.publish(`writerite:room::${id}`, JSON.stringify({
    type: 'CONFIG',
    senderId: sub.id,
    config,
  }));
  pubsub.publish(rwRoomTopic(sRoom.id), sRoomUpdate);
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
  const sRoomUpdate: IUpdatedUpdate<ISRoom> = { updated: sRoom };
  pubsub.publish(rwRoomTopic(sRoom.id), sRoomUpdate);
  return models.RwRoom.fromSRoom(prisma, sRoom);
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
  const sRoomUpdate: IUpdatedUpdate<ISRoom> = { updated: sRoom };
  pubsub.publish(rwRoomTopic(sRoom.id), sRoomUpdate);
  return models.RwRoom.fromSRoom(prisma, sRoom);
};

export const rwRoomMutation: IResolverObject<any, IContext, any> = {
  rwRoomCreate, rwRoomUpdateConfig, rwRoomAddOccupant, rwRoomDeactivate,
};
