import { IFieldResolver } from 'apollo-server-koa';

import { IUpdate, IContext } from '../../types';

import { updateMapFactory } from '../../util';
import { ISRoom, RwRoom } from '../../model/RwRoom';

export function rwRoomsTopic() {
  return `room`;
}

const rwRoomsUpdatesSubscribe: IFieldResolver<any, IContext, any> = async (
  _parent, _args, { pubsub },
): Promise<AsyncIterator<IUpdate<ISRoom>> | null> => {
  return pubsub.asyncIterator<IUpdate<ISRoom>>(rwRoomsTopic());
};

export const rwRoomSubscription = {
  rwRoomsUpdates: {
    resolve: updateMapFactory(RwRoom.fromSRoom),
    subscribe: rwRoomsUpdatesSubscribe,
  },
};
