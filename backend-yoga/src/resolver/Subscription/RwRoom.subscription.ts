import { IFieldResolver } from 'graphql-tools';

import { IUpdate, IRwContext } from '../../types';

import { PRoom } from '../../../generated/prisma-client';
import { pRoomToRwRoom } from '../RwRoom';
import { updateMapFactory, throwIfDevel } from '../../util';

export function rwRoomsTopic() {
  return `room`;
}

const rwRoomsUpdatesSubscribe: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, { pubsub },
): Promise<AsyncIterator<IUpdate<PRoom>> | null> => {
  try {
    return pubsub.asyncIterator<IUpdate<PRoom>>(rwRoomsTopic());
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomSubscription = {
  rwRoomsUpdates: {
    resolve: updateMapFactory(pRoomToRwRoom),
    subscribe: rwRoomsUpdatesSubscribe,
  },
};
