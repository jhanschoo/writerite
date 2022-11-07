import type { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';

export function queryHealth(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      query Health {
        health
      }
    `,
    variables: undefined,
  });
}

export function queryRepeatHealth(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<undefined>({
    server,
    document: gql`
      subscription RepeatHealth {
        repeatHealth
      }
    `,
    variables: undefined,
  });
}
