import { FC, KeyboardEvent } from 'react';
import { MessageContentType, MessageCreateDocument, RoomDetailFragment } from '@generated/graphql';
import { ActionIcon, createStyles, Group, Kbd, Stack, Text, Textarea } from '@mantine/core';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useForm } from '@mantine/form';
import { useMutation } from 'urql';

interface Props {
  room?: RoomDetailFragment;
}

const useStyles = createStyles((theme) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  return {
    input: {
      overflow: 'hidden',
    },
  };
});

export const ManageRoomPrimaryInput: FC<Props> = ({ room }) => {
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
  const handleSubmitAccelerator = (e: KeyboardEvent<HTMLInputElement>) => {
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
              visibility: form.values['chatInput'] ? 'visible' : 'hidden',
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
                <ActionIcon type="submit" variant="subtle" color="dark" title="Save">
                  <PaperPlaneIcon />
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