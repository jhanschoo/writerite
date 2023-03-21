import { FC } from 'react';
import { Box, Button, Flex, Stack, Title } from '@mantine/core';
import { DeckName } from '@/components/deck';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { DEFAULT_EDITOR_PROPS } from '@/components/RichTextEditor';
import { EditorContent, useEditor } from '@tiptap/react';

export interface ManageDeckFrontMatterContentProps
  extends Pick<ManageDeckProps['deck'], 'name' | 'description'> {
  handleEdit?: () => void;
}

export const ManageDeckFrontMatterContent: FC<ManageDeckFrontMatterContentProps> = ({
  name,
  description,
  handleEdit,
}) => {
  const content = description ?? null;
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    editable: false,
    extensions: [...(DEFAULT_EDITOR_PROPS.extensions || [])],
    content,
  });
  editor?.commands.setContent(content);
  return (
    <Stack>
      <Flex justify="space-between">
        <Title order={1}>
          <DeckName name={name} />
        </Title>
        {handleEdit && (
          <Button variant="outline" radius="xl" onClick={handleEdit}>
            Edit Deck Info
          </Button>
        )}
      </Flex>
      <EditorContent editor={editor} />
    </Stack>
  );
};
