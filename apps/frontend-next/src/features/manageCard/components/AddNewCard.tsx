import { useState } from "react";
import {
  Button,
  Box,
  Card,
  createStyles,
  Divider,
  LoadingOverlay,
  Text,
  Flex,
  getStylesRef,
} from "@mantine/core";

import { BareRichTextEditor, DEFAULT_EDITOR_PROPS } from "@/components/editor";
import { useMutation } from "urql";
import { ManageCardAltAnswers } from "./ManageCardAltAnswers";
import { JSONContent, useEditor } from "@tiptap/react";
import { graphql } from "@generated/gql";

const useStyles = createStyles(({ fn }) => {
  const { background, hover, border, color } = fn.variant({
    variant: "default",
  });
  return {
    cardRoot: {
      [`&:hover .${getStylesRef("cardCloseButton")}`]: {
        visibility: "visible",
      },
      // workaround for non-static Styles API for @mantine/tiptap@5.9.0 not being supported
      "& .mantine-RichTextEditor-root": {
        border: "none",
        color,
        ...fn.hover({
          backgroundColor: hover,
        }),
      },
      "& .mantine-RichTextEditor-toolbar": {
        border: "none",
        background: "transparent",
      },
      "& .mantine-RichTextEditor-content": {
        background: "transparent",
      },
    },
    cardCloseButton: {
      ref: getStylesRef("cardCloseButton"),
      position: "absolute",
      top: 0,
      right: 0,
      visibility: "hidden",
      borderTopLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    boxRoot: {
      // for 'LoadingOverlay' to work
      position: "relative",
    },
  };
});

interface Props {
  deckId: string;
  onDone(): void;
}

const AddNewCardMutation = graphql(/* GraphQL */ `
  mutation ManageCardAddNewCardMutation(
    $deckId: ID!
    $cards: [CardCreateMutationInput!]!
  ) {
    deckAddCards(deckId: $deckId, cards: $cards) {
      id
    }
  }
`);

export const AddNewCard = ({ deckId, onDone }: Props) => {
  const { classes } = useStyles();
  const [promptContent, setPromptContent] = useState<JSONContent | null>(null);
  const [fullAnswerContent, setFullAnswerContent] =
    useState<JSONContent | null>(null);
  const [answerValues, setAnswerValues] = useState<string[]>([]);
  const [{ fetching }, deckAddCard] = useMutation(AddNewCardMutation);
  // TODO: handle updating local state
  const updateStateToServer = () => {
    return deckAddCard({
      deckId,
      cards: [
        {
          prompt: promptContent,
          fullAnswer: fullAnswerContent,
          answers: answerValues,
          isTemplate: false,
        },
      ],
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
          <Flex
            gap="xs"
            direction={{ base: "column", md: "row" }}
            align={{ md: "flex-end" }}
          >
            <ManageCardAltAnswers
              answers={answerValues}
              onAnswersSave={setAnswerValues}
            />
            <Flex
              gap="xs"
              wrap={{ base: "wrap", sm: "nowrap" }}
              justify="flex-end"
            >
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
