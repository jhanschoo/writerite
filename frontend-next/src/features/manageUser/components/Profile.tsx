import { ProfilePicture } from '@/features/profilePicture';
import { useCurrentUser } from '@/hooks';
import { Stack, Text, useMantineTheme } from '@mantine/core';
import { FC } from 'react';

export const Profile: FC = () => {
  const currentUser = useCurrentUser();
  const theme = useMantineTheme();
  if (!currentUser) {
    return null;
  }
  return (
    <Stack align="center">
      <ProfilePicture user={currentUser} avatarProps={{ size: 168 }} />
      <Text>{currentUser.name}</Text>
    </Stack>
  );
};
