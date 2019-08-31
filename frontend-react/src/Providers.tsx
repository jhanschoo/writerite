import React, { useState, ReactNode } from 'react';

import { Provider } from 'react-redux';
import { store } from './store';

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './apolloClient';
import { persistedCache } from './cache';

import { ThemeProvider } from 'styled-components';
import theme from './theme';

import { BrowserRouter } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

const Providers = ({ children }: Props) => {
  const [cacheReady, setCacheReady] = useState(false);
  if (!cacheReady) {
    persistedCache.then(() => {
      setCacheReady(true);
    });
    return (<p>loading...</p>);
  }
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
};

export default Providers;
