import { UserAndToken } from './WrSignin';

export enum ActionTypes {
  SIGNIN = 'SIGNIN',
}

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly data: UserAndToken | null;
}

export type AuthorizationAction = SigninAction;

export const createSignin = (data: UserAndToken | null): AuthorizationAction => {
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
