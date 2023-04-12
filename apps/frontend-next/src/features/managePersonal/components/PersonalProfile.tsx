import { ToolbaredRichTextEditor, useContentEditor } from '@/components/editor';
import { UserProfile } from '@/components/user';
import { UserEditDocument } from '@generated/graphql';
import { Button, Flex, Input, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from 'urql';
import { ManagePersonalProps } from '../types';

export const PersonalProfile = ({ user }: ManagePersonalProps) => {
  const [{ fetching }, updateProfile] = useMutation(UserEditDocument);
  const [bio, setBio] = useState(user.bio ?? null);
  const [editing, setEditing] = useState(false);
  const [bioEditor, resetBioEditorContent] = useContentEditor({
    editorComponent: ToolbaredRichTextEditor,
    content: bio,
    setContent: setBio,
    placeholder: 'Tell us about yourself!',
  });
  const handleUpdateProfile = async () => {
    const { data } = await updateProfile({ bio });
    if (data) {
      const {
        userEdit: { bio },
      } = data;
      setBio(bio ?? null);
      setEditing(false);
    }
  };
  return (
    <>
      <UserProfile user={{ ...user, bio }} />
      {!editing && (
        <Button
          variant="outline"
          onClick={() => {
            setEditing(true);
            resetBioEditorContent(user.bio ?? null);
          }}
        >
          Edit Profile
        </Button>
      )}
      {editing && (
        <Stack
          sx={{
            // for 'LoadingOverlay' to work
            position: 'relative',
          }}
        >
          <LoadingOverlay visible={fetching} />
          <Input.Wrapper label="About Myself">{bioEditor}</Input.Wrapper>
          <Flex justify="flex-end" pt="xs" gap="xs">
            <Button
              variant="outline"
              onClick={() => {
                setBio(user.bio ?? null);
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
