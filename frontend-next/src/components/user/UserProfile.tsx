import { useContentViewer } from '@/components/editor';
import { ProfilePicture } from '@/features/profilePicture';
import { UserProfileFragment } from '@generated/graphql';
import { Flex, Paper, Stack, Text } from '@mantine/core';

interface Props {
  user: UserProfileFragment;
}

export const UserProfile = ({ user }: Props) => {
  const [viewerComponent] = useContentViewer(user.bio ?? null);
  return (
    <Paper shadow="xl" radius="lg" p="md">
      <Flex gap="xs">
        <ProfilePicture user={user} avatarProps={{ size: 84 }} />
        <Stack>
          <Text weight="bolder">{user.name}</Text>
          {viewerComponent}
        </Stack>
      </Flex>
    </Paper>
  );
};
