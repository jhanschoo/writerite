import md5 from "md5";

import { store } from "./store";

export const DEBOUNCE_DELAY = 5000;

export const SERVER_FETCH_LIMIT = 60;

export const getAuth = (): string => {
  const storeState = store.getState();
  const token = storeState.signin?.session?.token;
  return token ? `Bearer ${token}` : "";
};

export const emailToGravatarLink = (email: string): string => `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
