import { isSSRContext } from '@/utils';

const ACCESS_TOKEN_KEY = 'auth_token';

export function setAccessToken(token: string) {
  !isSSRContext() && window?.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  if (isSSRContext()) {
    return null;
  }
  return window?.localStorage?.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  !isSSRContext() && window?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
}
