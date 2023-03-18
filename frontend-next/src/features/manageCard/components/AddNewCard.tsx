import { FC, useState } from 'react';
import {
  Button,
  Box,
  Card,
  createStyles,
  Divider,
  LoadingOverlay,
  Text,
  Flex,
} from '@mantine/core';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import {
  BareRichTextEditor,
  DEFAULT_EDITOR_PROPS,
  ToolbaredRichTextEditor,
} from '@/components/RichTextEditor';
import { useMutation } from 'urql';
import { CardCreateDocument } from '@generated/graphql';
import { ManageCardAltAnswers } from './ManageCardAltAnswers';
import { JSONContent, useEditor } from '@tiptap/react';

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

interface Props extends ManageDeckProps {
  onDone(): void;
}

export const AddNewCard: FC<Props> = ({ deck: { id: deckId }, onDone }) => {
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
  const handleSave = async () => {
    await updateStateToServer();
    onDone();
  };
  const promptEditor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    content: promptContent,
    onUpdate({ editor }) {
      const latestPromptContent = editor.getJSON();
      setPromptContent(latestPromptContent);
    },
  });
  const fullAnswerEditor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    content: fullAnswerContent,
    onUpdate({ editor }) {
      const latestFullAnswerContent = editor.getJSON();
      setFullAnswerContent(latestFullAnswerContent);
    },
  });
  const handleSaveAndAddAnother = async () => {
    await updateStateToServer();
    promptEditor?.commands.clearContent();
    setPromptContent(null);
    fullAnswerEditor?.commands.clearContent();
    setFullAnswerContent(null);
    setAnswerValues([]);
  };

  return (
    <Box className={classes.boxRoot}>
      <Card withBorder shadow="sm" radius="md" className={classes.cardRoot}>
        <LoadingOverlay visible={fetching} />
        <Card.Section inheritPadding pt="sm">
          <Text size="xs" weight="bold">
            Front
          </Text>
        </Card.Section>
        {/* The LoadingOverlay is not placed first due to special formatting for first and last children of Card if those elements are Card.Section */}
        <LoadingOverlay visible={fetching} />
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
          <Flex gap="xs" direction={{ base: 'column', md: 'row' }} align={{ md: 'flex-end' }}>
            <ManageCardAltAnswers answers={answerValues} onAnswersSave={setAnswerValues} />
            <Flex gap="xs" wrap={{ base: 'wrap', sm: 'nowrap' }} justify="flex-end">
              <Button variant="subtle" onClick={onDone}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSave}>
                Save
              </Button>
              <Button variant="filled" onClick={handleSaveAndAddAnother}>
                Save and add another
              </Button>
            </Flex>
          </Flex>
        </Card.Section>
      </Card>
    </Box>
  );
};
