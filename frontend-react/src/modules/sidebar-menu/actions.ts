export enum ActionTypes {
  REGISTER = 'REGISTER',
  DEREGISTER = 'DEREGISTER',
  SHOW = 'SHOW',
  HIDE = 'HIDE',
}

export interface SidebarAction {
  readonly type: ActionTypes;
}

export const createRegister = (): SidebarAction => {
  return { type: ActionTypes.REGISTER };
};
export const createDeregister = (): SidebarAction => {
  return { type: ActionTypes.DEREGISTER };
};
export const createShow = (): SidebarAction => {
  return { type: ActionTypes.SHOW };
};
export const createHide = (): SidebarAction => {
  return { type: ActionTypes.HIDE };
};
