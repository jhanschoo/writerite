import { client } from '../../apolloClient';
import { ActionTypes, AuthorizationAction } from './actions';
import { UserAndToken } from './WrSignin';

export interface SigninState {
  data: UserAndToken | null;
}

export const initialState: SigninState = {
  data: null,
};

export const signin = (
  state: SigninState = initialState, action: AuthorizationAction,
): SigninState => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      if (action.data === null) {
        client.resetStore();
      }
      return { ...state, data: action.data };
    case ActionTypes.USER_EDIT:
      if (state.data === null) {
        return state;
      }
      return Object.assign({}, { ...state, data: { ...state.data, user: action.user } });
    default:
      return state;
  }
};
