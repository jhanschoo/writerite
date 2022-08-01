import { DeckEditDocument } from '@generated/graphql';
import { ActionIcon, createStyles, Group, Input, LoadingOverlay, Text, Title, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { formatISO, parseISO } from 'date-fns';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useMutation } from 'urql';
import { ManageDeckProps } from '../types/ManageDeckProps';

const useStyles = createStyles((_theme, _params, getRef) => ({
  editText: {
    ref: getRef('editText'),
    visibility: 'hidden',
  },

  titleContainer: {
    [`&:hover .${getRef('editText')}`]: {
      visibility: 'visible',
    },
  },
}));

export const ManageDeckTitle: FC<ManageDeckProps> = ({ deck: { id, name, editedAt } }) => {
  const [{ fetching }, mutateTitle] = useMutation(DeckEditDocument);
  const inputRef = useRef<HTMLInputElement>(null);
  const { classes: { editText, titleContainer } } = useStyles();
  const [showNameInput, setShowNameInput] = useState(false);
  useEffect(() => {
    showNameInput && inputRef.current?.select();
  }, [showNameInput]);
  const form = useForm({
    initialValues: {
      name,
    },
  });
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  const startEditingTitle = () => {
    if (!fetching) {
      setShowNameInput(true);
      form.setFieldValue('name', name);
    }
  };
  const endEditingTitle = async (newName: string) => {
    if (name !== newName) {
      await mutateTitle({ id, name: newName });
    }
    setShowNameInput(false);
  };
  const submitForm = form.onSubmit(({ name: newName }) => endEditingTitle(newName));
  if (showNameInput) {
    return (
      <Group align="baseline" sx={{ position: 'relative' }}>
        <LoadingOverlay visible={fetching} />
        <form
          onSubmit={submitForm}
        >
          <Input.Wrapper label="Title" description="Enter a new title for your deck" required error={form.getInputProps('name').error}>
            <Input
              placeholder="Deck Title"
              type="text"
              size="xl"
              styles={{
                input: { fontWeight: 'bolder' },
              }}
              ref={inputRef}
              disabled={fetching}
              required
              autoFocus
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                (e.key === 'Escape') && setShowNameInput(false)
              }
              rightSection={
                <ActionIcon size={48} variant="subtle" color="dark" title="Save">
                  <PaperPlaneIcon />
                </ActionIcon>
              }
              rightSectionWidth={60}
              {...form.getInputProps('name')}
            />
            <Text color="dimmed" size="xs" sx={{ marginTop: '7px' }}>Press &lsquo;esc&rsquo; to cancel editing</Text>
          </Input.Wrapper>
        </form>
      </Group>
    );
  }
  return (
    <UnstyledButton className={titleContainer} component="div" onClick={startEditingTitle}>
      <Group align="baseline">
        <Title order={1}>{name}</Title>
        <Text color="dimmed" className={editText}>edit...</Text>
      </Group>
    </UnstyledButton>
  );
};
