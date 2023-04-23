import type { NextPage } from 'next';
import { PersonalDashboard } from '@/features/managePersonal';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';
import { graphql, useFragment } from '@generated/gql';
import { useQuery } from 'urql';

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
