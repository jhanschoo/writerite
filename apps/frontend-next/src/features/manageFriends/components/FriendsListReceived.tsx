import { FragmentType, graphql, useFragment } from '@generated/gql';
import { useMutation, useQuery } from 'urql';

import { UserProfile, UserProfileFragment } from '@/components/user';
import { Button, Center } from '@mantine/core';

const FriendsListReceivedItemBefriendMutation = graphql(/* GraphQL */ `
  mutation FriendsListReceivedItemBefriendMutation($befriendedId: ID!) {
    befriend(befriendedId: $befriendedId) {
      id
    }
  }
`);

const FriendsListReceivedQuery = graphql(/* GraphQL */ `
  query FriendsListReceivedQuery {
    befrienders {
      edges {
        node {
          id
          ...UserProfile
        }
      }
    }
  }
`);

interface FriendsListReceivedItemProps {
  user: FragmentType<typeof UserProfileFragment>;
}

const FriendsListReceivedItem = ({ user }: FriendsListReceivedItemProps) => {
  const userFragment = useFragment(UserProfileFragment, user);
  const { id: befriendedId } = userFragment;
  const [, befriend] = useMutation(FriendsListReceivedItemBefriendMutation);
  return (
    <UserProfile user={userFragment}>
      <Center>
          <Button onClick={() => befriend({ befriendedId })}>Accept</Button>
      </Center>
    </UserProfile>
  );
};

export const FriendsListReceived = () => {
  const [{ data }] = useQuery({ query: FriendsListReceivedQuery });
  const users =
    data?.befrienders?.edges?.flatMap((edge) =>
      edge?.node ? [edge.node] : []
    ) ?? [];
  if (users.length === 0) {
    return <p>You have no received friend requests pending approval.</p>;
  }
  const userProfiles = users.map((user) => <FriendsListReceivedItem key={user.id} user={user} />);
  return <>{userProfiles}</>;
};
