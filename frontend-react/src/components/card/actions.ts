import { initialState } from './reducers';

export enum ActionTypes {
  SET_CARD_FILTER = 'SET_CARD_FILTER',
}

export interface SetCardFilterAction {
  readonly type: ActionTypes.SET_CARD_FILTER;
  readonly filter: string;
}

export type CardAction = SetCardFilterAction;

export const setCardFilter = (filter: string): SetCardFilterAction => {
  return {
    type: ActionTypes.SET_CARD_FILTER,
    filter,
  };
};

export const resetCardFilter = (): SetCardFilterAction => {
  return setCardFilter(initialState.filter);
};
