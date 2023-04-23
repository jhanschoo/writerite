import { buildHTTPExecutor } from '@graphql-tools/executor-http';

import { graphql } from '../../generated/gql';
import { testQuery, testSubscription } from '../misc';

export function queryHealth(executor: ReturnType<typeof buildHTTPExecutor>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query Health {
        health
      }
    `),
    variables: {},
  });
}

export function subscriptionRepeatHealth(
  executor: ReturnType<typeof buildHTTPExecutor>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription({
    executor,
    document: graphql(/* GraphQL */ `
      subscription RepeatHealth {
        repeatHealth
      }
    `),
    variables: {},
  });
}
