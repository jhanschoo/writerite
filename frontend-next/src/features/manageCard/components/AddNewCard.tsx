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
  Flex,
} from '@mantine/core';
import stringify from 'fast-json-stable-stringify';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { DEFAULT_EDITOR_PROPS, RichTextEditor } from '@/components/RichTextEditor';
import { useMutation } from 'urql';
import { CardCreateDocument } from '@generated/graphql';
import { ManageCardAltAnswers } from './ManageCardAltAnswers';
import { JSONContent } from '@tiptap/core';

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

export const AddNewCard: FC<ManageDeckProps> = ({ deck: { id: deckId } }) => {
  const { classes } = useStyles();
  const [promptContent, setPromptContent] = useState<JSONContent | null>(null);
  const [fullAnswerContent, setFullAnswerContent] = useState<JSONContent | null>(null);
  const [answerValues, setAnswerValues] = useState<string[]>([]);
  const [{ fetching }, deckAddCard] = useMutation(CardCreateDocument);
  const updateStateToServer = () => {
    return deckAddCard({
      deckId,
      card: {
        prompt: promptContent,
        fullAnswer: fullAnswerContent,
        answers: answerValues,
      },
    });
  };

  return (
    <Box className={classes.boxRoot}>
      <Card withBorder shadow="sm" radius="md" className={classes.cardRoot}>
        <Card.Section inheritPadding pt="sm">
          <Text size="xs" weight="bold">
            Front
          </Text>
        </Card.Section>
        {/* The LoadingOverlay is not placed first due to special formatting for first and last children of Card if those elements are Card.Section */}
        <LoadingOverlay visible={fetching} />
        <Card.Section>
          <RichTextEditor
            editorProps={{
              ...DEFAULT_EDITOR_PROPS,
              content: promptContent,
              onUpdate({ editor }) {
                const latestPromptContent = editor.getJSON();
                setPromptContent(latestPromptContent);
              },
            }}
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
            editorProps={{
              ...DEFAULT_EDITOR_PROPS,
              content: fullAnswerContent,
              onUpdate({ editor }) {
                const latestFullAnswerContent = editor.getJSON();
                setFullAnswerContent(latestFullAnswerContent);
              },
            }}
          />
        </Card.Section>
        <Divider />
        <Card.Section inheritPadding py="sm">
          <Flex gap="xs" wrap="wrap">
            <ManageCardAltAnswers answers={answerValues} onAnswersSave={setAnswerValues} />
            <Button variant="subtle">Cancel</Button>
            <Button variant="default">Save</Button>
            <Button variant="filled">Save and add another</Button>
          </Flex>
        </Card.Section>
      </Card>
    </Box>
  );
};
