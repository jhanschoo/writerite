import { useRouter } from 'next/router';
import { FRIENDS_ROOM_PATH } from '@/paths';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Button, Center } from '@mantine/core';
import { useQuery } from 'urql';

import { UserProfile, UserProfileFragment } from '@/components/user';

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
  const router = useRouter();
  return (
    <UserProfile user={userFragment}>
      <Center>
        <Button onClick={() => router.push(FRIENDS_ROOM_PATH(userFragment.id))}>
          Message
        </Button>
      </Center>
    </UserProfile>
  );
};

export const FriendsMutualsList = () => {
  const [{ data }] = useQuery({ query: FriendsMutualsListQuery });
  const users =
    data?.friends?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ??
    [];
  const userProfiles = users.map((user) => (
    <FriendsMutualsListItem key={user.id} user={user} />
  ));
  return <>{userProfiles}</>;
};
