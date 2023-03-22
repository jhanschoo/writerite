import { ProfilePicture } from '@/features/profilePicture';
import { Stack, Text } from '@mantine/core';
import { EditorContent } from '@tiptap/react';
import { ManagePersonalProps } from '../types';

export const Profile = ({ user }: ManagePersonalProps) => {
  const bioContent = user.bio?.content;
  return (
    <Stack>
      <ProfilePicture user={user} avatarProps={{ size: 168 }} />
      <Text>{user.name}</Text>
    </Stack>
  );
};
