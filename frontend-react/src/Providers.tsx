import React, { ReactNode, useState } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import { persistedCacheStatus } from "./cache";

import { ThemeProvider } from "styled-components";
import theme from "./theme";

import { BrowserRouter } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

const loading = <p>loading...</p>;

const Providers = ({ children }: Props): JSX.Element => {
  const [cacheReady, setCacheReady] = useState(false);
  if (!cacheReady) {
    void persistedCacheStatus.then(() => setCacheReady(true));
    return loading;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={loading} persistor={persistor}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ThemeProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
