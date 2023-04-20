import type { NextPage } from "next";

import { StandardLayout } from "@/features/standardLayout/components/StandardLayout";
import { PersonalDashboard } from "@/features/managePersonal";
import { useQuery } from "urql";
import { graphql, useFragment } from "@generated/gql";

const UserQuery = graphql(/* GraphQL */ `
  query UserQuery {
    me {
      id
      ...PersonalProfile
    }
  }
`);

const User: NextPage = () => {
  const [{ fetching, data }] = useQuery({
    query: UserQuery,
    variables: {},
  });
  if (!data) {
    return null;
  }
  return (
    <StandardLayout>
      {data?.me && <PersonalDashboard user={data.me} />}
    </StandardLayout>
  );
};

export default User;
