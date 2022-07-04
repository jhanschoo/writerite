import type { WrServer } from "../../../src/graphqlServer";
import { gql, inject } from "../misc";
import { HealthQuery } from "../../../generated/typescript-operations";

export async function queryHealth(server: WrServer) {
  return inject<HealthQuery, undefined>({
    server,
    document: gql`
      query Health {
        health
      }
    `,
    variables: undefined,
  });
}
