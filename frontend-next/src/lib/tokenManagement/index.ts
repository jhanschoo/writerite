import { isSSRContext } from '@/utils';
import { decodeJwt } from 'jose';

const ACCESS_TOKEN_KEY = 'auth_token';

const CURRENT_USER_KEY = 'auth_current_user';

const EXPIRY_KEY = 'auth_expiry';

const EXPIRY_TOLERANCE_IN_SECONDS = 15;

export function setSessionInfo({ token, currentUser }: SerializedSessionInfo) {
  if (!isSSRContext() && window?.localStorage) {
    const { iat, exp } = decodeJwt(token);
    if (!iat || !exp) {
      return;
    }
    // compute delta relative to client time, to correct for imprecision
    // due to client clock at the cost of imprecision due to rtt
    // EXPIRY_TOLERANCE of 15 seconds is added expires our token eariler
    // to hedge for rtt and clock drift.
    const delta = exp - iat - EXPIRY_TOLERANCE_IN_SECONDS;
    const feExp = Date.now() + delta;
    window.localStorage.setItem(EXPIRY_KEY, feExp.toString());
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.localStorage.setItem(CURRENT_USER_KEY, currentUser);
  }
}

/**
 * NB: use this function instead of `unsetSessionInfo` upon knowledge
 * that our claims are stale.
 */
export function expireCurrentSession() {
  if (window?.localStorage?.getItem(EXPIRY_KEY)) {
    window.localStorage.setItem(EXPIRY_KEY, '0');
  }
}

export function sessionNeedsRefreshing() {
  const feExp = window?.localStorage?.getItem(EXPIRY_KEY);
  if (feExp) {
    // expired session needs refreshing
    return parseInt(feExp) <= Date.now();
  }
  // NB: this returns false if there is no current session (user is not logged in)
  return false;
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
    window.localStorage.removeItem(EXPIRY_KEY);
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
