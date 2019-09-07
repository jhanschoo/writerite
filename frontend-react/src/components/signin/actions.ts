import { UserAndToken } from './WrSignin';
import { WrUserStub } from '../../client-models/gqlTypes/WrUserStub';

export enum ActionTypes {
  SIGNIN = 'SIGNIN',
  USER_EDIT = 'USER_EDIT',
}

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly data: UserAndToken | null;
}

export interface UserEditAction {
  readonly type: ActionTypes.USER_EDIT;
  readonly user: WrUserStub;
}

export type AuthorizationAction = SigninAction | UserEditAction;

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

export const createUserEdit = (user: WrUserStub): AuthorizationAction => {
  return {
    type: ActionTypes.USER_EDIT,
    user,
  };
};
