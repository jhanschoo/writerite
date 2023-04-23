import { useState } from 'react';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMutation } from 'urql';

import { ToolbaredRichTextEditor, useContentEditor } from '@/components/editor';
import { UserProfile } from '@/components/user';

export const PersonalProfileFragment = graphql(/* GraphQL */ `
  fragment PersonalProfile on User {
    id
    bareId
    bio
    name
  }
`);

const PersonalProfileEditMutation = graphql(/* GraphQL */ `
  mutation PersonalProfileEdit($input: OwnProfileEditMutationInput!) {
    ownProfileEdit(input: $input) {
      ...PersonalProfile
    }
  }
`);

interface Props {
  user: FragmentType<typeof PersonalProfileFragment>;
}

export const PersonalProfile = ({ user }: Props) => {
  const userFragment = useFragment(PersonalProfileFragment, user);
  const [{ fetching }, updateProfile] = useMutation(
    PersonalProfileEditMutation
  );
  const [bio, setBio] = useState(userFragment.bio ?? null);
  const [bioEditor, resetBioEditorContent] = useContentEditor({
    editorComponent: ToolbaredRichTextEditor,
    content: bio,
    setContent: setBio,
    placeholder: 'Tell us about yourself!',
  });
  const handleUpdateProfile = async () => {
    const { data } = await updateProfile({ input: { bio } });
    if (data) {
      const { ownProfileEdit } = data;
      const { bio } = useFragment(PersonalProfileFragment, ownProfileEdit);
      setBio(bio ?? null);
    }
  };
  return (
    <Grid>
      <Grid.Col md={6} span={12}>
        <UserProfile user={{ ...userFragment, bio }} />
      </Grid.Col>
      <Grid.Col md={6} span={12}>
        <Card
          sx={{
            // for 'LoadingOverlay' to work
            position: 'relative',
          }}
          withBorder
          radius="lg"
        >
          <Title order={2}>Edit Profile</Title>
          <LoadingOverlay visible={fetching} />
          <Input.Wrapper label="About Myself">{bioEditor}</Input.Wrapper>
          <Flex justify="flex-end" pt="xs" gap="xs">
            <Button
              variant="outline"
              onClick={() => {
                setBio(userFragment.bio ?? null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save changes</Button>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
