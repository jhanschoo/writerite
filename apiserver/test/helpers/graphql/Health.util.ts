import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { gql, testQuery, testSubscription } from "../misc";

export function queryHealth(executor: ReturnType<typeof buildHTTPExecutor>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    executor,
    document: gql`
      query Health {
        health
      }
    `,
    variables: undefined,
  });
}

export function subscriptionRepeatHealth(
  executor: ReturnType<typeof buildHTTPExecutor>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<undefined>({
    executor,
    document: gql`
      subscription RepeatHealth {
        repeatHealth
      }
    `,
    variables: undefined,
  });
}
