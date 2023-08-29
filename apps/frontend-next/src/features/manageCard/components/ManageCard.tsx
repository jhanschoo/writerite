import { useEffect, useState } from 'react';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  Button,
  Card,
  Divider,
  Flex,
  Loader,
  LoadingOverlay,
  Text,
  createStyles,
  getStylesRef,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { JSONContent, useEditor } from '@tiptap/react';
import stringify from 'fast-json-stable-stringify';
import { useMutation } from 'urql';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';

import { BareRichTextEditor, DEFAULT_EDITOR_PROPS } from '@/components/editor';

import { ManageCardAltAnswers } from './ManageCardAltAnswers';

const useStyles = createStyles(({ fn }) => {
  const { hover, color } = fn.variant({
    variant: 'default',
  });
  return {
    cardRoot: {
      // for 'LoadingOverlay' to work
      position: 'relative',
      [`&:hover .${getStylesRef('cardCloseButton')}`]: {
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
      ref: getStylesRef('cardCloseButton'),
      position: 'absolute',
      top: 0,
      right: 0,
      visibility: 'hidden',
      borderTopLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  };
});

interface State {
  prompt: JSONContent | null;
  fullAnswer: JSONContent | null;
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

const ManageCardFragment = graphql(/* GraphQL */ `
  fragment ManageCard on Card {
    answers
    fullAnswer
    id
    isPrimaryTemplate
    isTemplate
    prompt
  }
`);

const ManageCardEditCardMutation = graphql(/* GraphQL */ `
  mutation ManageCardEditCardMutation($input: CardEditMutationInput!) {
    cardEdit(input: $input) {
      ...ManageCard
    }
  }
`);

const ManageCardDeleteCardMutation = graphql(/* GraphQL */ `
  mutation ManageCardDeleteCardMutation($id: ID!) {
    cardDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  card: FragmentType<typeof ManageCardFragment>;
  forceLoading: boolean;
  onCardDeleted: () => unknown;
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
export const ManageCard = ({ card, forceLoading, onCardDeleted }: Props) => {
  const { id, prompt, fullAnswer, answers, isTemplate } = useFragment(
    ManageCardFragment,
    card
  );
  const { classes } = useStyles();
  const initialState = {
    prompt,
    fullAnswer,
    answers,
  } as State;
  const [promptContent, setPromptContent] = useState<JSONContent | null>(
    prompt ?? null
  );
  const [fullAnswerContent, setFullAnswerContent] =
    useState<JSONContent | null>(fullAnswer ?? null);
  const [answerValues, setAnswerValues] = useState<string[]>(answers);
  const [{ fetching }, cardEdit] = useMutation(ManageCardEditCardMutation);
  const [{ fetching: fetchingDelete }, cardDelete] = useMutation(
    ManageCardDeleteCardMutation
  );
  const updateStateToServer = (newState: State) =>
    cardEdit({
      input: {
        id,
        ...newState,
        isTemplate,
      },
    });
  const debounced = useDebouncedCallback(
    updateStateToServer,
    STANDARD_DEBOUNCE_MS,
    {
      maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS,
    }
  );
  const promptEditor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    content: promptContent,
    onUpdate({ editor }) {
      const latestPromptContent = editor.getJSON();
      const latestState = {
        prompt: latestPromptContent,
        fullAnswer: fullAnswerContent,
        answers: answerValues,
      };
      setPromptContent(latestPromptContent);
      debounceIfStateDeltaExists(debounced, initialState, latestState);
    },
  });
  const fullAnswerEditor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    content: fullAnswerContent,
    onUpdate({ editor }) {
      const latestFullAnswerContent = editor.getJSON();
      const latestState = {
        prompt: promptContent,
        fullAnswer: latestFullAnswerContent,
        answers: answerValues,
      };
      setFullAnswerContent(latestFullAnswerContent);
      debounceIfStateDeltaExists(debounced, initialState, latestState);
    },
  });
  const handleCardDelete = async () => {
    debounced.cancel();
    await cardDelete({ id });
    onCardDeleted();
  };
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
        <BareRichTextEditor editor={promptEditor} />
      </Card.Section>
      <Divider />
      <Card.Section inheritPadding pt="sm">
        <Text size="xs" weight="bold">
          Back
        </Text>
      </Card.Section>
      <Card.Section>
        <BareRichTextEditor editor={fullAnswerEditor} />
      </Card.Section>
      <Divider />
      <Card.Section inheritPadding py="sm">
        <Flex>
          <ManageCardAltAnswers
            answers={answerValues}
            onAnswersSave={handleAnswersSave}
          />
          <Loader visibility={hasUnsavedChanges ? 'visible' : 'hidden'} />
        </Flex>
      </Card.Section>
    </Card>
  );
};
