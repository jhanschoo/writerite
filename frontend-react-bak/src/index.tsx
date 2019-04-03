import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './store';

import { BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { client } from './apolloClient';

import { ThemeProvider } from 'styled-components';
import theme from './theme';

import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
  </Provider>
),
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();