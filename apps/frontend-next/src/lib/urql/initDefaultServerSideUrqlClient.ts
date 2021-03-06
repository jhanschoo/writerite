import { initUrqlClient } from 'next-urql';
import { ssrExchange } from 'urql';

import { commonUrqlOptions, getExchanges } from './common';

export const initDefaultServerSideUrqlClient = () => {
  const ssr = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      ...commonUrqlOptions,
      exchanges: getExchanges(ssr),
    },
    false
  );
  if (!client) {
    throw new Error(
      'unable to initialize urql client in initDefaultUrqlClient'
    );
  }
  const getUrqlState = () => ssr.extractData();
  return [client, getUrqlState] as const;
};
