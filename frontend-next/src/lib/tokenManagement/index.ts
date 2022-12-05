import { isSSRContext } from '@/utils';

const ACCESS_TOKEN_KEY = 'auth_token';

const CURRENT_USER_KEY = 'auth_current_user';

export function setSessionInfo({ token, currentUser }: SerializedSessionInfo) {
  if (!isSSRContext() && window?.localStorage) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.localStorage.setItem(CURRENT_USER_KEY, currentUser);
  }
}

export function getAccessToken() {
  if (isSSRContext()) {
    return null;
  }
  return window?.localStorage?.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentUser() {
  if (isSSRContext()) {
    return null;
  }
  const serializedCurrentUser = window?.localStorage?.getItem(CURRENT_USER_KEY);
  return (serializedCurrentUser && (JSON.parse(serializedCurrentUser) as CurrentUser)) || null;
}

export function unsetSessionInfo() {
  if (!isSSRContext() && window?.localStorage) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export interface SerializedSessionInfo {
  token: string;
  currentUser: string;
}

export interface SessionInfo {
  token: string;
  currentUser: CurrentUser;
}

export enum Roles {
  User = 'User',
  Admin = 'Admin',
}

export interface CurrentUser {
  id: string;
  name: string | null;
  roles: Roles[];
  occupyingActiveRoomSlugs: Record<string, string>;
}
