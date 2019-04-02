import { ActionTypes, CardAction } from './actions';

export interface CardState {
  readonly filter: string;
}

export const initialState: CardState = {
  filter: '',
};

export const card = (
  state: CardState = initialState, action: CardAction,
): CardState => {
  const { type, filter } = action;
  switch (type) {
    case ActionTypes.SET_CARD_FILTER:
      return Object.assign({}, state, {
        filter,
      });
    default:
      return state;
  }
};
