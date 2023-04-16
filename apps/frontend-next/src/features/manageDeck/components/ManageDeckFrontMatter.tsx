import { ToolbaredRichTextEditor, useContentViewer } from '@/components/editor';
import { useContentEditor } from '@/components/editor/useContentEditor';
import { Box, Button, Flex, LoadingOverlay } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from 'urql';
import { ManageDeckFrontMatterContent } from './ManageDeckFrontMatterContent';
import { ManageDeckFrontMatterEditor } from './ManageDeckFrontMatterEditor';
import { FragmentType, graphql, useFragment } from '@generated/gql';

const ManageDeckFrontMatterEditMutation = graphql(/* GraphQL */ `
  mutation ManageDeckFrontMatterEdit($input: DeckEditMutationInput!) {
    deckEdit(input: $input) {
      answerLang
      description
      id
      name
      promptLang
    }
  }
`);

const ManageDeckFrontMatterFragment = graphql(/* GraphQL */ `
  fragment ManageDeckFrontMatter on Deck {
    id
    name
    description
  }
`);

interface Props {
  deck: FragmentType<typeof ManageDeckFrontMatterFragment>;
}

export const ManageDeckFrontMatter = ({ deck }: Props) => {
  const deckFragment = useFragment(ManageDeckFrontMatterFragment, deck);
  const [{ fetching }, mutateDeckInfo] = useMutation(ManageDeckFrontMatterEditMutation);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(deckFragment.name);
  const [description, setDescription] = useState(deckFragment.description ?? null);
  const [descriptionEditor, resetEditorContent] = useContentEditor({
    editorComponent: ToolbaredRichTextEditor,
    content: description,
    setContent: setDescription,
    placeholder: 'Write a description...',
  });
  const [descriptionViewer, viewer] = useContentViewer(description);
  const content = (
    <ManageDeckFrontMatterContent
      name={name}
      descriptionElement={descriptionViewer}
      handleEdit={
        editing /* TODO: add check for owner of deck */
          ? undefined
          : () => {
              setEditing(true);
              resetEditorContent(viewer?.getJSON() ?? null);
            }
      }
    />
  );
  if (!editing) {
    return content;
  }
  const handleSave = async () => {
    const { data } = await mutateDeckInfo({ input: { id: deckFragment.id, name, description } });
    if (data) {
      const {
        deckEdit: { name, description },
      } = data;
      setEditing(false);
      setName(name);
      setDescription(description ?? null);
    }
  };
  return (
    <Flex wrap="wrap">
      <Box
        sx={(theme) => ({
          width: '100%',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            width: '50%',
          },
          // for 'LoadingOverlay' to work
          position: 'relative',
        })}
        p="xs"
      >
        <LoadingOverlay visible={fetching} />
        <ManageDeckFrontMatterEditor
          name={name}
          setName={setName}
          descriptionEditorElement={descriptionEditor}
        />
        <Flex justify="flex-end" pt="xs" gap="xs">
          <Button
            variant="outline"
            onClick={() => {
              setName(deckFragment.name);
              setDescription(deckFragment.description ?? null);
              setEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </Flex>
      </Box>
      <Box
        sx={(theme) => ({
          width: '100%',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            width: '50%',
          },
        })}
        p="xs"
      >
        {content}
      </Box>
    </Flex>
  );
};
