import { UserProfileFragment, UserProfile } from '@/components/user';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Button, Center } from '@mantine/core';
import { useQuery } from 'urql';

const FriendsMutualsListQuery = graphql(/* GraphQL */ `
  query FriendsMutualsListQuery {
    friends {
      edges {
        cursor
        node {
          id
          ...UserProfile
        }
      }
    }
  }
`);

interface FriendsMutualsListItemProps {
  user: FragmentType<typeof UserProfileFragment>;
}

const FriendsMutualsListItem = ({ user }: FriendsMutualsListItemProps) => {
  const userFragment = useFragment(UserProfileFragment, user);
  return (
    <UserProfile user={userFragment}>
      <Center>
          <Button>Message</Button>
      </Center>
    </UserProfile>
  );
};

export const FriendsMutualsList = () => {
  const [{ data }] = useQuery({ query: FriendsMutualsListQuery });
  const users =
    data?.friends?.edges?.flatMap((edge) =>
      edge?.node ? [edge.node] : []
    ) ?? [];
  const userProfiles = users.map((user) => <FriendsMutualsListItem key={user.id} user={user} />);
  return <>{userProfiles}</>;
};
