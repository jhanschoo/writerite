import { withUrqlClient } from 'next-urql';
import { commonUrqlOptions, getExchanges } from './common';

export const withDefaultUrqlClient = withUrqlClient(
  (ssrExchange) => ({
    ...commonUrqlOptions,
    exchanges: getExchanges(ssrExchange),
  }),
  { ssr: false, staleWhileRevalidate: true }
);

export const withSSRUrqlClient = withUrqlClient(
  (ssrExchange) => ({
    ...commonUrqlOptions,
    exchanges: getExchanges(ssrExchange),
  }),
  { ssr: true, staleWhileRevalidate: true }
);
