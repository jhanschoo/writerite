import { useContentViewer } from "@/components/editor";
import { ProfilePicture } from "@/features/profilePicture";
import { JSONObject } from "@/utils";
import { graphql } from "@generated/gql";
import { Flex, Paper, Stack, Text } from "@mantine/core";

export const UserProfileFragment = graphql(/* GraphQL */ `
  fragment UserProfile on User {
    id
    bio
    name
  }
`);

interface Props {
  user: {
    id: string;
    bio: JSONObject | null;
    name: string;
  };
}

export const UserProfile = ({ user }: Props) => {
  const { bio, name } = user;
  const [viewerComponent] = useContentViewer(bio ?? null);
  return (
    <Paper shadow="xl" radius="lg" p="md">
      <Flex gap="xs">
        <ProfilePicture user={user} avatarProps={{ size: 84 }} />
        <Stack>
          <Text weight="bolder">{name}</Text>
          {viewerComponent}
        </Stack>
      </Flex>
    </Paper>
  );
};
