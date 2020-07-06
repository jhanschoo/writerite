import md5 from 'md5';

import { store } from './store';

import { client } from './apolloClient';

export const getAuth = () => {
  const storeState = store.getState();
  const token = storeState?.signin?.session?.token;
  return token ? `Bearer ${token}` : '';
};

export const emailToGravatarLink = (email: string) => {
  return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
};

export const printApolloError = (error: Error) => {
  // tslint:disable-next-line: no-console
  console.error(`Error communicating with server: ${error.message}`);
  return client.resetStore();
};
