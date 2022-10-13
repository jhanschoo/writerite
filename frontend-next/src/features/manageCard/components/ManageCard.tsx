import { FC, useEffect, useState } from 'react';
import { ActionIcon, Button, Box, Card, createStyles, Divider, Group, Loader, LoadingOverlay, Paper, Stack, Text } from '@mantine/core';
import { Delta } from 'quill';
import stringify from 'fast-json-stable-stringify';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { ManageCardAltAnswerInput } from './ManageCardAltAnswerInput';
import { ManageCardAltAnswer } from './ManageCardAltAnswer';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { useMutation } from 'urql';
import { CardEditDocument } from '@generated/graphql';
import { RichTextEditorProps } from '@mantine/rte';

const useStyles = createStyles(({ fn }, _params, getRef) => {
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
    cardRoot: {
      [`&:hover .${getRef('cardCloseButton')}`]: {
        visibility: "visible",
      }
    },
    cardCloseButton: {
      ref: getRef('cardCloseButton'),
      position: 'absolute',
      top: 0,
      right: 0,
      visibility: "hidden",
      borderTopLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    boxRoot: {
      position: 'relative'
    }
  };
});

interface Props {
  card: ManageDeckProps["deck"]["cardsDirect"][number];
  onDelete: () => void;
  forceLoading: boolean;
}

interface State {
  prompt: Delta;
  fullAnswer: Delta;
  answers: string[];
}

function debounceIfStateDeltaExists(debounced: DebouncedState<(nextState: State) => unknown>, initialState: State, latestState: State) {
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
 * * the latest definite state of each answer in the latest definite state of answers, where
 * by latest definite state of answers we mean the answers array containing all answers except any newly added answer currently being edited
 * by latest definite state of answer we mean the answer if it is not in editing state, or what the answer was before entering editing state if it is in editing state
 * 
 * When the user is done adding, deleting, or editing any answer, we expect to update the server immediately with:
 * * the latest state of prompt
 * * the latest state of fullAnswer
 * * the latest definite state of each answer in the latest definite state of answers, which is the latest state of answers
 * 
 * We then add the further assumption:
 * * getting the latest definite state of each answer is no problem
 * 
 * Then observe the following
 * * clearly when updating the server, after answers edits, we have no problem since we just use the latest state of everything.
 * * while still updating the server, if we edit the prompt or fullAnswer we may have a problem only if we are editing a newly edited answer as well. To this end, when we add an answer, set its latest definite state to the illegal empty string, and then the latest definite state is simply the latest state after filtering out empty strings.
 */
export const ManageCard: FC<Props> = ({ card, onDelete, forceLoading }) => {
  const { id, prompt, fullAnswer, answers } = card;
  const initialState = { prompt: prompt as unknown, fullAnswer: fullAnswer as unknown, answers } as State;
  const [promptContent, setPromptContent] = useState<Delta>(prompt);
  const [fullAnswerContent, setFullAnswerContent] = useState<Delta>(fullAnswer);
  const [answerValues, setAnswerValues] = useState<string[]>(answers);
  const [{ fetching }, cardEdit] = useMutation(CardEditDocument);
  const updateStateToServer = (newState: State) => {
    cardEdit({
      id, ...newState
    });
  };
  const debounced = useDebouncedCallback(updateStateToServer, STANDARD_DEBOUNCE_MS, { maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS });
  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );
  const hasUnsavedChanges = fetching || debounced.isPending();

  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null);
  const existsCurrentlyEditing = currentlyEditing !== null;
  const { classes } = useStyles();
  const handlePromptChange: RichTextEditorProps["onChange"] = (_value, _delta, _sources, editor) => {
    const latestPromptContent = editor.getContents();
    const latestState = {
      prompt: latestPromptContent,
      fullAnswer: fullAnswerContent,
      answers: answerValues,
    }
    setPromptContent(latestPromptContent);
    debounceIfStateDeltaExists(debounced, initialState, latestState);
  }
  const handleFullAnswerChange: RichTextEditorProps["onChange"] = (_value, _delta, _sources, editor) => {
    const latestFullAnswerContent = editor.getContents();
    const latestState = {
      prompt: promptContent,
      fullAnswer: latestFullAnswerContent,
      answers: answerValues,
    }
    setFullAnswerContent(latestFullAnswerContent);
    debounceIfStateDeltaExists(debounced, initialState, latestState);
  }
  const handleAnswersChange = (latestAnswers: string[]) => {
    latestAnswers = latestAnswers.map((answer) => answer.trim()).filter((answer) => Boolean(answer));
    debounced.cancel()
    const latestState = {
      prompt: promptContent,
      fullAnswer: fullAnswerContent,
      answers: latestAnswers,
    };
    setAnswerValues(latestAnswers);
    updateStateToServer(latestState);
  }
  return (
    <Box className={classes.boxRoot}>
      <Card withBorder shadow="sm" radius="md" className={classes.cardRoot}>
        <Card.Section inheritPadding pt="sm">
          <Button size="xs" radius="xs" compact rightIcon={<TrashIcon />} variant="filled" className={classes.cardCloseButton}>
            delete card
          </Button>
          <Text size="xs" weight="bold">Front</Text>
        </Card.Section>
        {/* The LoadingOverlay is not placed first due to special formatting for first and last children of Card if those elements are Card.Section */}
        <LoadingOverlay visible={forceLoading} />
        <Card.Section>
          <RichTextEditor
            value={promptContent}
            onChange={handlePromptChange}
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
            onChange={handleFullAnswerChange}
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
                    return <ManageCardAltAnswerInput
                      key={index} 
                      initialAnswer={answer}
                      onCancel={() => {
                        setCurrentlyEditing(null);
                        if (!answer) {
                          const latestAnswers = Array.from(answers);
                          latestAnswers.splice(index, 1);
                          handleAnswersChange(latestAnswers)
                        }
                      }}
                      onSave={(newAnswer) => {
                        const answerToSave = newAnswer.trim();
                        const latestAnswers = Array.from(answers);
                        setCurrentlyEditing(null);
                        if (answerToSave) {
                          latestAnswers.splice(index, 1, answerToSave);
                        } else {
                          latestAnswers.splice(index, 1);
                        }
                        handleAnswersChange(latestAnswers);
                      }}
                    />;
                  }
                  return <ManageCardAltAnswer
                    key={index}
                    answer={answer}
                    onRemove={() => {
                      const latestAnswers = Array.from(answers)
                      latestAnswers.splice(index, 1)
                      handleAnswersChange(latestAnswers)
                    }}
                    editable={!existsCurrentlyEditing}
                    onStartEditing={() => setCurrentlyEditing(index)}
                  />
                })}
                {currentlyEditing === null && (
                  <Paper
                    withBorder px="xs" py="6px"
                    onClick={() => {
                      const latestAnswers = [...answers, ""];
                      setAnswerValues(latestAnswers);
                      setCurrentlyEditing(answerValues.length);
                    }}
                  >
                    <ActionIcon size="sm" variant="transparent"><PlusIcon /></ActionIcon>
                  </Paper>
                )}
              </Group>
            </Stack>
            <Loader visibility={hasUnsavedChanges ? "visible" : "hidden"} />
          </Group>
        </Card.Section>
      </Card>
    </Box>
  );
};
