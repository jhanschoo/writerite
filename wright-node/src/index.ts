import "./assertConfig";
import { client } from "./apolloClient";

import { USER_QUERY } from "./gql/queries";
import { UserQuery, UserQueryVariables } from "./gql/gqlTypes/UserQuery";
import { RoomsUpdatesSubscription } from "./gql/gqlTypes/RoomsUpdatesSubscription";
import { ROOMS_UPDATES_SUBSCRIPTION } from "./gql/subscription";

// void client.query<UserQuery, UserQueryVariables>({
//   query: USER_QUERY,
//   variables: { id: "bcedd80c-0f81-4fb0-a2b5-839820a23400" },
// })
//   .then((data) => console.log(data));

void client.subscribe<RoomsUpdatesSubscription>({
  query: ROOMS_UPDATES_SUBSCRIPTION,
}).subscribe({
  next: console.log,
});
