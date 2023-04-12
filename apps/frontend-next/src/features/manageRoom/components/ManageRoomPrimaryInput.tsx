import { KeyboardEvent } from 'react';
import { MessageContentType, MessageCreateDocument, RoomDetailFragment } from '@generated/graphql';
import { createStyles, Group, Kbd, Stack, Text, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useMutation } from 'urql';
import { ActionIcon } from '@/components/ActionIcon';

interface Props {
  room?: RoomDetailFragment;
}

const useStyles = createStyles((theme) => ({
  input: {
    overflow: 'hidden',
  },
}));

export const ManageRoomPrimaryInput = ({ room }: Props) => {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      chatInput: '',
    },
  });
  const [{ fetching }, messageCreateMutation] = useMutation(MessageCreateDocument);
  const submitForm = form.onSubmit((values) => {
    form.reset();
    messageCreateMutation({
      content: { text: values.chatInput },
      slug: room?.slug as string,
      type: MessageContentType.Text,
    });
  });
  const handleSubmitAccelerator = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitForm();
    }
  };
  return (
    <form onSubmit={submitForm}>
      <Group p="md" position="center" grow>
        <Stack spacing="xs">
          <Text
            fz="xs"
            sx={{
              visibility: form.values.chatInput ? 'visible' : 'hidden',
            }}
          >
            (<Kbd>Alt</Kbd>/<Kbd>Shift</Kbd>/<Kbd>Ctrl</Kbd>/<Kbd>Option</Kbd>)+<Kbd>Enter</Kbd> to
            insert a line
          </Text>
          <Textarea
            autosize
            minRows={1}
            radius="md"
            size="md"
            classNames={classes}
            rightSection={
              <Group>
                <ActionIcon type="submit" variant="subtle" title="Save">
                  <IconSend />
                </ActionIcon>
              </Group>
            }
            onKeyDown={handleSubmitAccelerator}
            {...form.getInputProps('chatInput')}
          />
        </Stack>
      </Group>
    </form>
  );
};
