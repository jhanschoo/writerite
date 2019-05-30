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
  const { type, data } = action;
  switch (type) {
    case ActionTypes.SIGNIN:
      if (data === null) {
        client.resetStore();
      }
      return Object.assign({}, state, {
        data,
      });
    default:
      return state;
  }
};
