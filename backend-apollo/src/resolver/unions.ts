import { IResolverObject } from 'apollo-server-koa';
import { IContext, IUpdate } from '../types';
import { IRwCard } from '../model/RwCard';
import { IRwDeck } from '../model/RwDeck';
import { IRwRoom } from '../model/RwRoom';
import { IRwRoomMessage } from '../model/RwRoomMessage';

const resolveType = (name: string) => (parent: IUpdate<any>) => {
  if ('created' in parent) {
    return name + 'Created';
  }
  if ('updated' in parent) {
    return name + 'Updated';
  }
  if ('deletedId' in parent) {
    return name + 'Deleted';
  }
  throw Error('Update type resolver unable to resolve to narrowed type');
};

// tslint:disable-next-line:variable-name
const RwCardUpdate: IResolverObject<IUpdate<IRwCard>, IContext, any> = {
  __resolveType: resolveType('RwCard'),
};

// tslint:disable-next-line:variable-name
const RwDeckUpdate: IResolverObject<IUpdate<IRwDeck>, IContext, any> = {
  __resolveType: resolveType('RwDeck'),
};

// tslint:disable-next-line:variable-name
const RwRoomUpdate: IResolverObject<IUpdate<IRwRoom>, IContext, any> = {
  __resolveType: resolveType('RwCard'),
};

// tslint:disable-next-line:variable-name
const RwRoomMessageUpdate: IResolverObject<IUpdate<IRwRoomMessage>, IContext, any> = {
  __resolveType: resolveType('RwRoomMessage'),
};

export const unionTypeResolvers: IResolverObject<any, IContext, any> = {
  RwCardUpdate,
  RwDeckUpdate,
  RwRoomUpdate,
  RwRoomMessageUpdate,
  // Note: Upload resolver automatically added by apollo-server
};
