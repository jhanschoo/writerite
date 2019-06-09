import { initialState } from './reducers';

export enum ActionTypes {
  SET_ROOM_FILTER = 'SET_ROOM_FILTER',
}

export interface SetRoomFilterAction {
  readonly type: ActionTypes.SET_ROOM_FILTER;
  readonly filter: string;
}

export type RoomAction = SetRoomFilterAction;

export const setRoomFilter = (filter: string): SetRoomFilterAction => {
  return {
    type: ActionTypes.SET_ROOM_FILTER,
    filter,
  };
};

export const resetRoomFilter = (): SetRoomFilterAction => {
  return setRoomFilter(initialState.filter);
};
