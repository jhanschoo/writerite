import { withUrqlClient } from 'next-urql';
import { isSSRContext } from '@/utils';
import { commonUrqlOptions, getExchanges } from './common';

export const withDefaultUrqlClient = withUrqlClient(
  isSSRContext()
    ? (ssrExchange) => ({
        ...commonUrqlOptions,
        exchanges: getExchanges(ssrExchange),
      })
    : (ssrExchange) => ({
        ...commonUrqlOptions,
        exchanges: getExchanges(ssrExchange),
      }),
  { ssr: false, staleWhileRevalidate: true }
);
