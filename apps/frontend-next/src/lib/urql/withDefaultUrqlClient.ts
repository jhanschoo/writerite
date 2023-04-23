import { withUrqlClient } from 'next-urql';

import { commonUrqlOptions, getExchanges } from './common';

export const withDefaultUrqlClient = withUrqlClient(
  (ssrExchange) => ({
    ...commonUrqlOptions,
    exchanges: getExchanges(ssrExchange),
  }),
  { staleWhileRevalidate: true }
);
