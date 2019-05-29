import React from 'react';

import { ApolloProvider } from 'react-apollo';
import { client } from './apolloClient';

import md5 from 'md5';

export const emailToGravatarLink = (email: string) => {
  return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
};

export const printApolloError = (error: Error) => {
  // tslint:disable-next-line: no-console
  console.error(`Error communicating with server: ${error.message}`);
  return client.resetStore();
};

export const withProviders = (App: JSX.Element) => {
  return (
      <ApolloProvider client={client}>
            {App}
      </ApolloProvider>
  );
};
