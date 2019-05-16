import { ActionTypes, SidebarAction } from './actions';

export interface SidebarState {
  num: number;
  hidden: boolean;
}

export const initialState: SidebarState = {
  num: 0,
  hidden: true,
};

export const sidebar = (
  state: SidebarState = initialState, action: SidebarAction,
): SidebarState => {
  const { type } = action;
  switch (type) {
    case ActionTypes.REGISTER:
      return Object.assign({}, state, {
        num: state.num + 1,
        hidden: true,
      });
    case ActionTypes.DEREGISTER:
      return Object.assign({}, state, {
        num: state.num - 1,
        hidden: true,
      });
    case ActionTypes.SHOW:
      return (state.num)
      ? Object.assign({}, state, {
        hidden: false,
      })
      : state;
    case ActionTypes.HIDE:
      return  Object.assign({}, state, {
        hidden: true,
      });
    default:
      return state;
  }
};
