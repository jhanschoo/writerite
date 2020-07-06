import { client } from '../../apolloClient';
import { ActionTypes, AuthorizationAction } from './actions';
import { CurrentUserAndToken } from '../../types';

export interface SigninState {
  session: CurrentUserAndToken | null;
}

export const initialState: SigninState = {
  session: null,
};

export const signin = (
  state: SigninState = initialState, action: AuthorizationAction,
): SigninState => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      if (action.session === null) {
        client.resetStore();
      }
      return { ...state, session: action.session };
    case ActionTypes.USER_EDIT:
      if (state.session === null) {
        return state;
      }
      return Object.assign({}, { ...state, data: { ...state.session, user: action.user } });
    default:
      return state;
  }
};
