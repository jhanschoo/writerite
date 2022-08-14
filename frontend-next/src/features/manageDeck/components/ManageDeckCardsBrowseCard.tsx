import { FC, useState } from 'react';
import { Card, createStyles, Divider, Stack, Text } from '@mantine/core';
import { Delta } from 'quill';

import { ManageDeckProps } from '../types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { useFocusWithin } from '@mantine/hooks';

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

export const ManageDeckCardsBrowseCard: FC<Props> = ({ card }) => {
  const { prompt, fullAnswer } = card;
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
    </Card>
  );
};
