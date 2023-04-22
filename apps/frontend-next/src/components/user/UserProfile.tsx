import { useContentViewer } from "@/components/editor";
import { ProfilePicture } from "@/features/profilePicture";
import { JSONObject } from "@/utils";
import { graphql } from "@generated/gql";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";

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
    bio: JSONObject | null;
    name: string;
  };
}

export const UserProfile = ({ user }: Props) => {
  const { id, bio, name } = user;
  const [viewerComponent] = useContentViewer(bio ?? null);
  return (
    <Card shadow="xl" radius="lg" p="md">
      <Flex gap="xs">
        <ProfilePicture user={user} avatarProps={{ size: 84 }} />
        <Stack>
          <Flex>
            <Text>
              <Text weight="bolder" span>
                {name}
              </Text>
              #{id}
            </Text>
            <ActionIcon size="xs">
              <IconCopy onClick={() => {
                navigator.clipboard.writeText(id);
                notifications.show({
                  message: `id ${id} copied to clipboard`
                })
              }} />
            </ActionIcon>
          </Flex>
          {viewerComponent}
        </Stack>
      </Flex>
    </Card>
  );
};
