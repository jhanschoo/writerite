import "./assertConfig";
import { client } from "./apolloClient";

import { RoomsUpdatesSubscription } from "./gql/gqlTypes/RoomsUpdatesSubscription";
import { ROOMS_UPDATES_SUBSCRIPTION } from "./gql/subscription";
import { USER_QUERY } from "./gql/queries";
import { UserQuery, UserQueryVariables } from "./gql/gqlTypes/UserQuery";

void client.query<UserQuery, UserQueryVariables>({
  query: USER_QUERY,
  variables: { id: "a0236142-0cb2-4c70-b32a-3ccca8f625b0" },
})
  .then((data) => console.log(data));

void client.subscribe<RoomsUpdatesSubscription>({
  query: ROOMS_UPDATES_SUBSCRIPTION,
}).subscribe({
  next: console.log,
});
