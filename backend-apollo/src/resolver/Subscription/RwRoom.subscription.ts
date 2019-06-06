import { IFieldResolver, IResolverOptions, IResolverObject } from 'apollo-server-koa';

import { IUpdate, IContext } from '../../types';

import { updateMapFactory } from '../../util';
import { ISRoom, RwRoom } from '../../model/RwRoom';

export function rwRoomTopic(id: string) {
  return `room:id::${id}`;
}

const rwRoomUpdatesSubscribe: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { pubsub },
): Promise<AsyncIterator<IUpdate<ISRoom>> | null> => {
  return pubsub.asyncIterator<IUpdate<ISRoom>>(rwRoomTopic(id));
};

const rwRoomUpdates: IResolverOptions<any, IContext, any> = {
  resolve: updateMapFactory(RwRoom.fromSRoom),
  subscribe: rwRoomUpdatesSubscribe,
};

export const rwRoomSubscription: IResolverObject<any, IContext, any> = {
  rwRoomUpdates,
};
