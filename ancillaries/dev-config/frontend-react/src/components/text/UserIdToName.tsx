import React from "react";

import { useQuery } from "@apollo/client";
import { UserQuery, UserQueryVariables } from "src/gqlTypes";
import { USER_QUERY } from "src/gql";

interface Props {
  id: string;
}

const UserIdToName = ({ id }: Props): JSX.Element | null => {
  // eslint-disable-next-line no-shadow
  const { data } = useQuery<UserQuery, UserQueryVariables>(USER_QUERY, {
    variables: { id },
    fetchPolicy: "cache-first",
  });
  if (data?.user) {
    // eslint-disable-next-line no-shadow
    const { name, email } = data.user;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return <>{name || email}</>;
  }
  return null;
};

export default UserIdToName;
