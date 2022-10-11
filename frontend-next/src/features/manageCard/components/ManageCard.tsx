import { FC, useEffect, useState } from 'react';
import { ActionIcon, Card, createStyles, Divider, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import { Delta } from 'quill';
import stringify from 'fast-json-stable-stringify';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { useListState } from '@mantine/hooks';
import { PlusIcon } from '@radix-ui/react-icons';
import { useDebouncedCallback } from 'use-debounce';
import { ManageCardAltAnswerInput } from './ManageCardAltAnswerInput';
import { ManageCardAltAnswer } from './ManageCardAltAnswer';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { useMutation } from 'urql';
import { CardEditDocument } from '@generated/graphql';

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

interface State {
  promptContent: Delta;
  fullAnswerContent: Delta;
  answerValues: string[];
}

export const ManageCard: FC<Props> = ({ card }) => {
  const { id, prompt, fullAnswer, answers } = card;
  const state = { prompt, fullAnswer, answers };
  const [promptContent, setPromptContent] = useState<Delta>(prompt);
  const [fullAnswerContent, setFullAnswerContent] = useState<Delta>(fullAnswer);
  const [answerValues, handlers] = useListState<string>(answers);
  const currentState = { prompt: promptContent, fullAnswer: fullAnswerContent, answers: answerValues };
  const [initialStateString, currentStateString] =
    [state, currentState].map(stringify);
  const [{ fetching }, cardEdit] = useMutation(CardEditDocument);
  const debounced = useDebouncedCallback(async (debouncedState) => {
    if (stringify(debouncedState) !== initialStateString) {
      await cardEdit({
        id, ...debouncedState
      });
    }
  }, STANDARD_DEBOUNCE_MS, { maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS });
  const hasUnsavedChanges = fetching || debounced.isPending();
  useEffect(() => {
    debounced(currentState);
  }, [currentStateString]);

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
          value={promptContent}
          onChange={(_value, _delta, _sources, editor) => { setPromptContent(editor.getContents()); }}
          classNames={classes}
        />
      </Card.Section>
      <Divider />
      <Card.Section inheritPadding pt="sm">
        <Text size="xs" weight="bold">Back</Text>
      </Card.Section>
      <Card.Section>
        <RichTextEditor
          value={fullAnswerContent}
          onChange={(_value, _delta, _sources, editor) => { setFullAnswerContent(editor.getContents()); }}
          classNames={classes}
        />
      </Card.Section>
      <Divider />
      <Card.Section inheritPadding py="sm">
        <Group>
          <Stack spacing={0} sx={{ flexGrow: 1 }}>
            <Text size="xs" weight="bold">Accepted answers</Text>
            <Group spacing="xs" py="xs">
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
                <Paper withBorder px="xs" py="6px" onClick={() => { handlers.append(""); setCurrentlyEditing(answerValues.length); }}>
                  <ActionIcon size="sm" variant="transparent"><PlusIcon /></ActionIcon>
                </Paper>
              )}
            </Group>
          </Stack>
          <Loader visibility={hasUnsavedChanges ? "visible" : "hidden"} />
        </Group>
      </Card.Section>
    </Card>
  );
};
