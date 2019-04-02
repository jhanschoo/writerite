import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import md5 from 'md5';

import { store } from './store';
import { client } from './apolloClient';

export const WriteRiteMark = () => (
  // <span className="wr-mark-style">WriteRite</span>
  <span>WriteRite</span>
);

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
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          {App}
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
