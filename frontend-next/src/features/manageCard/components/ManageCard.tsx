import { FC, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Card,
  createStyles,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import stringify from 'fast-json-stable-stringify';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import {
  DEFAULT_EDITOR_PROPS,
  RichTextEditor,
  UneditableRichTextEditor,
} from '@/components/RichTextEditor';
import { IconTrash } from '@tabler/icons';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { useMutation } from 'urql';
import { CardDeleteDocument, CardEditDocument } from '@generated/graphql';
import { ManageCardAltAnswers } from './ManageCardAltAnswers';

const useEditorStyles = createStyles(({ fn }) => {
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
    },
  };
});

const useStyles = createStyles(({ fn }, _params, getRef) => {
  const { background, hover, border, color } = fn.variant({ variant: 'default' });
  return {
    cardRoot: {
      [`&:hover .${getRef('cardCloseButton')}`]: {
        visibility: 'visible',
      },
      // workaround for non-static Styles API for @mantine/tiptap@5.9.0 not being supported
      '& .mantine-RichTextEditor-root': {
        border: 'none',
        color,
        ...fn.hover({
          backgroundColor: hover,
        }),
      },
      '& .mantine-RichTextEditor-toolbar': {
        border: 'none',
        background: 'transparent',
      },
      '& .mantine-RichTextEditor-content': {
        background: 'transparent',
      },
    },
    cardCloseButton: {
      ref: getRef('cardCloseButton'),
      position: 'absolute',
      top: 0,
      right: 0,
      visibility: 'hidden',
      borderTopLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    boxRoot: {
      position: 'relative',
    },
  };
});

interface Props {
  card: ManageDeckProps['deck']['cardsDirect'][number];
  onDelete: () => void;
  forceLoading: boolean;
}

interface State {
  prompt: Record<string, unknown>;
  fullAnswer: Record<string, unknown>;
  answers: string[];
}

function debounceIfStateDeltaExists(
  debounced: DebouncedState<(nextState: State) => unknown>,
  initialState: State,
  latestState: State
) {
  if (stringify(initialState) !== stringify(latestState)) {
    debounced(latestState);
  } else {
    debounced.cancel();
  }
}

/**
 * Regarding the state of ManageCard
 * `card.prompt`, `card.fullAnswer`, `card.answers` should reflect the server-side state of these fields.
 *
 * When the user edits the prompt or the fullAnswer, we expect to update the server after at most STANDARD_DEBOUNCE_MS with:
 * * the latest state of prompt
 * * the latest state of fullAnswer
 * * the latest definite latest definite state of answers, where
 *   by latest definite state of answers we mean the answers array containing all answers except any
 *   newly added answer currently being edited, with each answer in the state before we started but
 *   not finished editing them, if we had started editing them but not finished.
 *
 * When the user is done adding, deleting, or editing any answer, we expect to update the server immediately with:
 * * the latest state of prompt
 * * the latest state of fullAnswer
 * * the latest definite state of each answer in the latest definite state of answers, which is the latest state of answers
 *
 * Then observe that
 * * clearly when updating the server, after answers edits, since there are no longer any
 *   answers being edited, the latest definite state of answers is the latest state of answers.
 *   and we have no problem obtaining the latest state of answers.
 * * while still updating the server, if we edit the prompt or fullAnswer, the latest definite state
 *   of answers is the latest answers that we have trued to update the server with (or the initial
 *   answers if we have not tried any such thing).
 */
export const ManageCard: FC<Props> = ({ card, onDelete, forceLoading }) => {
  const { id, prompt, fullAnswer, answers } = card;
  const { classes } = useStyles();
  const initialState = {
    prompt,
    fullAnswer,
    answers,
  } as State;
  const [promptContent, setPromptContent] = useState(prompt);
  const [fullAnswerContent, setFullAnswerContent] = useState(fullAnswer);
  const [answerValues, setAnswerValues] = useState<string[]>(answers);
  const [{ fetching }, cardEdit] = useMutation(CardEditDocument);
  const [{ fetching: fetchingDelete }, cardDelete] = useMutation(CardDeleteDocument);
  const updateStateToServer = (newState: State) => {
    return cardEdit({
      id,
      ...newState,
      fullAnswer: newState.fullAnswer ? { ...newState.fullAnswer } : undefined,
      prompt: newState.prompt ? { ...newState.prompt } : undefined,
    });
  };
  const handleCardDelete = () => {
    debounced.cancel();
    cardDelete({ id });
  };
  const debounced = useDebouncedCallback(updateStateToServer, STANDARD_DEBOUNCE_MS, {
    maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS,
  });
  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );
  const hasUnsavedChanges = fetching || debounced.isPending();

  const handleAnswersSave = (latestAnswers: string[]) => {
    debounced.cancel();
    const latestState = {
      prompt: promptContent,
      fullAnswer: fullAnswerContent,
      answers: latestAnswers,
    };
    setAnswerValues(latestAnswers);
    updateStateToServer(latestState);
  };
  return (
    <Box className={classes.boxRoot}>
      <Card withBorder shadow="sm" radius="md" className={classes.cardRoot}>
        <Card.Section inheritPadding pt="sm">
          <Button
            size="xs"
            radius="xs"
            compact
            rightIcon={<IconTrash size={18} />}
            variant="filled"
            className={classes.cardCloseButton}
            disabled={hasUnsavedChanges || fetchingDelete}
            onClick={handleCardDelete}
          >
            delete card
          </Button>
          <Text size="xs" weight="bold">
            Front
          </Text>
        </Card.Section>
        {/* The LoadingOverlay is not placed first due to special formatting for first and last children of Card if those elements are Card.Section */}
        <LoadingOverlay visible={forceLoading || fetchingDelete} />
        <Card.Section>
          <UneditableRichTextEditor
            editorProps={{
              ...DEFAULT_EDITOR_PROPS,
              content: Object.keys(promptContent).length ? promptContent : undefined,
              // onUpdate({ editor }) {
              //   const latestPromptContent = editor.getJSON();
              //   const latestState = {
              //     prompt: latestPromptContent,
              //     fullAnswer: fullAnswerContent,
              //     answers: answerValues,
              //   };
              //   setPromptContent(latestPromptContent);
              //   debounceIfStateDeltaExists(debounced, initialState, latestState);
              // },
            }}
            // classNames={editorClasses}
          />
        </Card.Section>
        <Divider />
        <Card.Section inheritPadding pt="sm">
          <Text size="xs" weight="bold">
            Back
          </Text>
        </Card.Section>
        <Card.Section>
          <UneditableRichTextEditor
            editorProps={{
              ...DEFAULT_EDITOR_PROPS,
              content: Object.keys(fullAnswerContent).length ? fullAnswerContent : undefined,
              // onUpdate({ editor }) {
              //   const latestFullAnswerContent = editor.getJSON();
              //   const latestState = {
              //     prompt: promptContent,
              //     fullAnswer: latestFullAnswerContent,
              //     answers: answerValues,
              //   };
              //   setFullAnswerContent(latestFullAnswerContent);
              //   debounceIfStateDeltaExists(debounced, initialState, latestState);
              // },
            }}
            // classNames={editorClasses}
          />
        </Card.Section>
        <Divider />
        <Card.Section inheritPadding py="sm">
          <Group>
            <ManageCardAltAnswers answers={answerValues} onAnswersSave={handleAnswersSave} />
            <Loader visibility={hasUnsavedChanges ? 'visible' : 'hidden'} />
          </Group>
        </Card.Section>
      </Card>
    </Box>
  );
};
