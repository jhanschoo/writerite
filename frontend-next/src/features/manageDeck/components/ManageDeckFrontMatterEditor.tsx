import { DEFAULT_EDITOR_PROPS, ToolbaredRichTextEditor } from '@/components/RichTextEditor';
import { JSONObject } from '@/utils';
import { Input, Stack, TextInput } from '@mantine/core';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { FC } from 'react';
import { ManageDeckProps } from '../types/ManageDeckProps';

export interface ManageDeckFrontMatterEditorProps
  extends Pick<ManageDeckProps['deck'], 'name' | 'description'> {
  setName: (name: string) => void;
  setDescription: (description: JSONObject) => void;
}

export const ManageDeckFrontMatterEditor: FC<ManageDeckFrontMatterEditorProps> = ({
  name,
  description,
  setName,
  setDescription,
}) => {
  const content = description ?? null;
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    extensions: [
      ...(DEFAULT_EDITOR_PROPS.extensions || []),
      Placeholder.configure({ placeholder: 'Write a description...' }),
    ],
    content,
    onUpdate({ editor }) {
      const updatedJsonContent = editor.getJSON();
      setDescription(updatedJsonContent);
    },
  });
  return (
    <Stack>
      <TextInput
        label="Title"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Input.Wrapper label="Description">
        <ToolbaredRichTextEditor editor={editor} />
      </Input.Wrapper>
    </Stack>
  );
};
