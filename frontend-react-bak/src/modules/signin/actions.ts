import { OptionalUserAndToken } from './types';

export enum ActionTypes {
  SIGNIN = 'SIGNIN',
}

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly data: OptionalUserAndToken;
}

export type AuthorizationAction = SigninAction;

export const createSignin = (data: OptionalUserAndToken): AuthorizationAction => {
  return {
    type: ActionTypes.SIGNIN,
    data,
  };
};

export const createSignout = (): AuthorizationAction => {
  return {
    type: ActionTypes.SIGNIN,
    data: null,
  };
};
