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
import type { Delta as QuillDelta } from 'quill';
import Delta, { Op } from 'quill-delta';
import stringify from 'fast-json-stable-stringify';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { TrashIcon } from '@radix-ui/react-icons';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { useMutation } from 'urql';
import { CardDeleteDocument, CardEditDocument } from '@generated/graphql';
import { RichTextEditorProps } from '@mantine/rte';
import { ManageCardAltAnswers } from './ManageCardAltAnswers';

/* Note: unfortunately quill types and quill-delta have different typing even though they should be the same.
 *   For this reason we have to do some type munging.
 */

type DeltaPojo = { ops: Op[]; };

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

const useStyles = createStyles((_theme, _params, getRef) => {
  return {
    cardRoot: {
      [`&:hover .${getRef('cardCloseButton')}`]: {
        visibility: 'visible',
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
  prompt: QuillDelta;
  fullAnswer: QuillDelta;
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
  const { classes: editorClasses } = useEditorStyles();
  const { classes: cardDeleteButtonClasses } = useStyles();
  const initialState = {
    prompt: prompt as unknown,
    fullAnswer: fullAnswer as unknown,
    answers,
  } as State;
  const [promptContent, setPromptContent] = useState<QuillDelta>(new Delta(prompt as DeltaPojo) as unknown as QuillDelta);
  const [fullAnswerContent, setFullAnswerContent] = useState<QuillDelta>(new Delta(fullAnswer as DeltaPojo) as unknown as QuillDelta);
  const [answerValues, setAnswerValues] = useState<string[]>(answers);
  const [{ fetching }, cardEdit] = useMutation(CardEditDocument);
  const [{ fetching: fetchingDelete }, cardDelete] = useMutation(CardDeleteDocument);
  const updateStateToServer = (newState: State) =>{
    console.log(newState);
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

  const handlePromptChange: RichTextEditorProps['onChange'] = (
    _value,
    _delta,
    _sources,
    editor
  ) => {
    const latestPromptContent = new Delta(editor.getContents().ops) as unknown as QuillDelta;
    const latestState = {
      prompt: latestPromptContent,
      fullAnswer: fullAnswerContent,
      answers: answerValues,
    };
    setPromptContent(latestPromptContent);
    debounceIfStateDeltaExists(debounced, initialState, latestState);
  };
  const handleFullAnswerChange: RichTextEditorProps['onChange'] = (
    _value,
    _delta,
    _sources,
    editor
  ) => {
    const latestFullAnswerContent = new Delta(editor.getContents().ops) as unknown as QuillDelta;
    const latestState = {
      prompt: promptContent,
      fullAnswer: latestFullAnswerContent,
      answers: answerValues,
    };
    setFullAnswerContent(latestFullAnswerContent);
    debounceIfStateDeltaExists(debounced, initialState, latestState);
  };
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
    <Box className={cardDeleteButtonClasses.boxRoot}>
      <Card withBorder shadow="sm" radius="md" className={cardDeleteButtonClasses.cardRoot}>
        <Card.Section inheritPadding pt="sm">
          <Button
            size="xs"
            radius="xs"
            compact
            rightIcon={<TrashIcon />}
            variant="filled"
            className={cardDeleteButtonClasses.cardCloseButton}
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
          <RichTextEditor
            value={promptContent as unknown as QuillDelta}
            onChange={handlePromptChange}
            classNames={editorClasses}
          />
        </Card.Section>
        <Divider />
        <Card.Section inheritPadding pt="sm">
          <Text size="xs" weight="bold">
            Back
          </Text>
        </Card.Section>
        <Card.Section>
          <RichTextEditor
            value={fullAnswerContent as unknown as QuillDelta}
            onChange={handleFullAnswerChange}
            classNames={editorClasses}
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
