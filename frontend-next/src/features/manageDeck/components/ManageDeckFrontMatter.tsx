import { DeckEditDocument } from '@generated/graphql';
import { Box, Button, Flex, LoadingOverlay } from '@mantine/core';
import { FC, useState } from 'react';
import { useMutation } from 'urql';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckFrontMatterContent } from './ManageDeckFrontMatterContent';
import { ManageDeckFrontMatterEditor } from './ManageDeckFrontMatterEditor';

export const ManageDeckFrontMatter: FC<ManageDeckProps> = ({ deck }) => {
  const [{ fetching }, mutateDeckInfo] = useMutation(DeckEditDocument);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description);
  const content = (
    <ManageDeckFrontMatterContent
      name={name}
      description={description}
      handleEdit={
        editing /* TODO: add check for owner of deck */ ? undefined : () => setEditing(true)
      }
    />
  );
  if (!editing) {
    return content;
  }
  const handleSave = async () => {
    const { data } = await mutateDeckInfo({ id: deck.id, name, description });
    if (data) {
      const {
        deckEdit: { name, description },
      } = data;
      setEditing(false);
      setName(name);
      setDescription(description);
    }
  };
  return (
    <Flex wrap="wrap">
      <Box
        sx={(theme) => ({
          width: "100%",
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            width: '50%',
          },
        })}
        p="xs"
      >
        <LoadingOverlay visible={fetching} />
        <ManageDeckFrontMatterEditor
          name={name}
          description={description}
          setName={setName}
          setDescription={setDescription}
        />
        <Flex justify="flex-end" pt="xs" gap="xs">
          <Button
            variant="outline"
            onClick={() => {
              setName(deck.name);
              setDescription(deck.description);
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
          width: "100%",
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
