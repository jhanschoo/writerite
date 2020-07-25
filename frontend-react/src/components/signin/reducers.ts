import { client } from "../../apolloClient";
import { ActionTypes, AuthorizationAction } from "./actions";
import { CurrentUserAndToken } from "../../types";
import { Reducer } from "redux";

export interface SigninState {
  session: CurrentUserAndToken | null;
}

export const initialState: SigninState = {
  session: null,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const signin: Reducer<SigninState, AuthorizationAction> = (state = initialState, action: AuthorizationAction): SigninState => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      if (action.session === null) {
        void client.resetStore();
      }
      return { ...state, session: action.session };
    case ActionTypes.USER_EDIT:
      if (state.session === null) {
        return state;
      }
      return { ...state, session: { ...state.session, user: action.user } };
    default:
      return state;
  }
};
