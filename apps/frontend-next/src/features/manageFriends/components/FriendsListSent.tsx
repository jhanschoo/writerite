import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Button, Center } from '@mantine/core';
import { useMutation, useQuery } from 'urql';

import { UserProfile, UserProfileFragment } from '@/components/user';

const FriendsListSentItemUnbefriendMutation = graphql(/* GraphQL */ `
  mutation FriendsListSentItemUnbefriendMutation($befriendedId: ID!) {
    unbefriend(befriendedId: $befriendedId) {
      id
    }
  }
`);

const FriendsListSentQuery = graphql(/* GraphQL */ `
  query FriendsListSentQuery {
    befriendeds {
      edges {
        node {
          id
          ...UserProfile
        }
      }
    }
  }
`);

interface FriendsListSentItemProps {
  user: FragmentType<typeof UserProfileFragment>;
}

const FriendsListSentItem = ({ user }: FriendsListSentItemProps) => {
  const userFragment = useFragment(UserProfileFragment, user);
  const { id: befriendedId } = userFragment;
  const [, unbefriend] = useMutation(FriendsListSentItemUnbefriendMutation);
  return (
    <UserProfile user={userFragment}>
      <Center>
        <Button onClick={() => unbefriend({ befriendedId })} variant="outline">
          Cancel
        </Button>
      </Center>
    </UserProfile>
  );
};

export const FriendsListSent = () => {
  const [{ data }] = useQuery({ query: FriendsListSentQuery });
  const users =
    data?.befriendeds?.edges?.flatMap((edge) =>
      edge?.node ? [edge.node] : []
    ) ?? [];
  if (users.length === 0) {
    return <p>You have no sent friend requests pending their approval.</p>;
  }
  const userProfiles = users.map((user) => (
    <FriendsListSentItem key={user.id} user={user} />
  ));
  return <>{userProfiles}</>;
};
