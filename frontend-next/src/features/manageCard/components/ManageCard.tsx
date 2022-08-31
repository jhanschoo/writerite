import { FC, useState } from 'react';
import { ActionIcon, Badge, Card, createStyles, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { Delta } from 'quill';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { useListState } from '@mantine/hooks';
import { PlusIcon } from '@radix-ui/react-icons';
import { ManageCardAltAnswerInput } from './ManageCardAltAnswerInput';
import { ManageCardAltAnswer } from './ManageCardAltAnswer';

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
  const [answerValues, handlers] = useListState(answers);
  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null);
  const existsCurrentlyEditing = currentlyEditing !== null;
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
          {answerValues.map((answer, index) => {
            if (index === currentlyEditing) {
              return <ManageCardAltAnswerInput key={index} initialAnswer={answer} onCancel={() => {
                setCurrentlyEditing(null);
                if (!answer) {
                  handlers.remove(index);
                }
              }} onSave={(newAnswer) => {
                const answerToSave = newAnswer.trim();
                setCurrentlyEditing(null);
                if (answerToSave) {
                  handlers.setItem(index, answerToSave);
                } else {
                  handlers.remove(index);
                }
              }}
              />;
            }
            return <ManageCardAltAnswer key={index} answer={answer} onRemove={() => handlers.remove(index)} editable={!existsCurrentlyEditing} onStartEditing={() => setCurrentlyEditing(index)} />
          })}
          {currentlyEditing === null && (
            <Badge variant="outline" onClick={() => { handlers.append(""); setCurrentlyEditing(answerValues.length); }}>
              <ActionIcon size="xs" variant="transparent"><PlusIcon /></ActionIcon>
            </Badge>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
};
