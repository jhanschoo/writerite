import { FC, useState } from 'react';
import { ActionIcon, Badge, Card, createStyles, Divider, Group, Stack, Text } from '@mantine/core';
import { Delta } from 'quill';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { useFocusWithin } from '@mantine/hooks';
import { Cross1Icon, Cross2Icon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';

const useStyles = createStyles(({ fn }) => {
  const { background, hover, border, color } = fn.variant({ variant: 'default' });
  return {
    root: {
      backgroundColor: background,
      borderColor: border,
      borderRadius: 0,
      border: 'none',
      color,
      ...fn.hover({
        backgroundColor: hover,
      }),
    },
    toolbar: {
      borderRadius: 0,
      border: 'none',
      background: 'transparent',
    }
  };
});

interface Props {
  card: ManageDeckProps["deck"]["cardsDirect"][number];
}

export const ManageCard: FC<Props> = ({ card }) => {
  const { prompt, fullAnswer, answers } = card;
  const [promptDelta, setPromptDelta] = useState<string | Delta>(prompt);
  const [fullAnswerDelta, setFullAnswerDelta] = useState(fullAnswer);
  const { classes } = useStyles();
  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section inheritPadding pt="sm">
        <Text size="xs" weight="bold">Front</Text>
      </Card.Section>
      <Card.Section>
        <RichTextEditor
          value={promptDelta}
          onChange={setPromptDelta}
          classNames={classes}
        />
      </Card.Section>
      <Divider />
      <Card.Section inheritPadding pt="sm">
        <Text size="xs" weight="bold">Back</Text>
      </Card.Section>
      <Card.Section>
        <RichTextEditor
          value={fullAnswerDelta}
          onChange={setFullAnswerDelta}
          classNames={classes}
        />
      </Card.Section>
      <Card.Section inheritPadding py="sm">
        <Text size="xs" weight="bold">Accepted answers</Text>
        <Group spacing="xs">
          {answers.map((answer, index) => <Badge variant="light" key={index} rightSection={<Group spacing={0}><ActionIcon size="xs" variant="transparent"><Pencil1Icon /></ActionIcon><ActionIcon size="xs" variant="transparent"><Cross2Icon /></ActionIcon></Group>}>{answer}</Badge>)}
          <Badge variant="outline"><ActionIcon size="xs" variant="transparent"><PlusIcon /></ActionIcon></Badge>
        </Group>
      </Card.Section>
    </Card>
  );
};
