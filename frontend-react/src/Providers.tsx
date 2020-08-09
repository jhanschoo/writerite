import React, { ReactNode, useState } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import { persistedCacheStatus } from "./cache";

import { ThemeProvider } from "styled-components";
import theme from "./theme";

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
  return <Provider store={store}>
    <PersistGate loading={loading} persistor={persistor}>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </ApolloProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>;
};

export default Providers;
