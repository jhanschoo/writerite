import { PropsWithChildren } from 'react';
import { ProfilePicture } from '@/features/profilePicture';
import { JSONObject } from '@/utils';
import { graphql } from '@generated/gql';
import { ActionIcon, Card, Flex, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCopy } from '@tabler/icons-react';
import { EditorContent } from '@tiptap/react';

import { useContentViewer } from '@/components/editor';

export const UserProfileFragment = graphql(/* GraphQL */ `
  fragment UserProfile on User {
    id
    bareId
    bio
    name
  }
`);

interface Props {
  user: {
    id: string;
    bareId: string;
    bio?: JSONObject | null;
    name: string;
  };
}

export const UserProfile = ({ user, children }: PropsWithChildren<Props>) => {
  const { id, bio, name } = user;
  const viewer = useContentViewer(bio ?? null);
  const viewerComponent = <EditorContent editor={viewer} />;
  return (
    <Card shadow="xl" radius="lg" p="md">
      <Flex gap="xs" wrap="wrap" justify="flex-end">
        <ProfilePicture user={user} avatarProps={{ size: 84 }} />
        <Stack sx={{ flexGrow: 1 }}>
          <Flex>
            <Text>
              <Text weight="bolder" span>
                {name}
              </Text>
              #{id}
            </Text>
            <ActionIcon size="xs">
              <IconCopy
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  notifications.show({
                    message: `id ${id} copied to clipboard`,
                  });
                }}
              />
            </ActionIcon>
          </Flex>
          {viewerComponent}
        </Stack>
        {children}
      </Flex>
    </Card>
  );
};
