import { CurrentUser, CurrentUserAndToken } from "src/types";

export enum ActionTypes {
  SIGNIN = "SIGNIN",
  USER_EDIT = "USER_EDIT",
}

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly session: CurrentUserAndToken | null;
}

export interface UserEditAction {
  readonly type: ActionTypes.USER_EDIT;
  readonly user: CurrentUser;
}

export type AuthorizationAction = SigninAction | UserEditAction;

export const createSignin = (session: CurrentUserAndToken | null): SigninAction => ({
  type: ActionTypes.SIGNIN,
  session,
});

export const createSignout = (): SigninAction => ({
  type: ActionTypes.SIGNIN,
  session: null,
});

export const createUserEdit = (user: CurrentUser): UserEditAction => ({
  type: ActionTypes.USER_EDIT,
  user,
});
