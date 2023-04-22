import { ToolbaredRichTextEditor, useContentEditor } from "@/components/editor";
import { UserProfile } from "@/components/user";
import {
  Button,
  Flex,
  Input,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useMutation } from "urql";
import { FragmentType, graphql, useFragment } from "@generated/gql";

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
  const [editing, setEditing] = useState(false);
  const [bioEditor, resetBioEditorContent] = useContentEditor({
    editorComponent: ToolbaredRichTextEditor,
    content: bio,
    setContent: setBio,
    placeholder: "Tell us about yourself!",
  });
  const handleUpdateProfile = async () => {
    const { data } = await updateProfile({ input: { bio } });
    if (data) {
      const { ownProfileEdit } = data;
      const { bio } = useFragment(PersonalProfileFragment, ownProfileEdit);
      setBio(bio ?? null);
      setEditing(false);
    }
  };
  return (
    <>
      <UserProfile user={{ ...userFragment, bio }} />
      {!editing && (
        <Button
          variant="outline"
          onClick={() => {
            setEditing(true);
            resetBioEditorContent(userFragment.bio ?? null);
          }}
        >
          Edit Profile
        </Button>
      )}
      {editing && (
        <Stack
          sx={{
            // for 'LoadingOverlay' to work
            position: "relative",
          }}
        >
          <LoadingOverlay visible={fetching} />
          <Input.Wrapper label="About Myself">{bioEditor}</Input.Wrapper>
          <Flex justify="flex-end" pt="xs" gap="xs">
            <Button
              variant="outline"
              onClick={() => {
                setBio(userFragment.bio ?? null);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save changes</Button>
          </Flex>
        </Stack>
      )}
    </>
  );
};
