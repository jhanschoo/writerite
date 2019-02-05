import { ActionTypes, RoomAction } from './actions';

export interface RoomState {
  readonly filter: string;
}

export const initialState: RoomState = {
  filter: '',
};

export const room = (
  state: RoomState = initialState, action: RoomAction,
): RoomState => {
  const { type, filter } = action;
  switch (type) {
    case ActionTypes.SET_ROOM_FILTER:
      return Object.assign({}, state, {
        filter,
      });
    default:
      return state;
  }
};
