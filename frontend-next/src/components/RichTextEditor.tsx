import { RichTextEditor, Link } from '@mantine/tiptap';
import type { EditorOptions, JSONContent } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { FC } from 'react';

export const DEFAULT_EDITOR_PROPS: Partial<EditorOptions> = {
  extensions: [StarterKit, Underline, Link],
};

export interface RichTextEditorProps {
  editorProps: Partial<EditorOptions>;
}

export function accumulateContentText(item: JSONContent): string {
  const strs: string[] = [];
  const queue = [item];
  while (queue.length) {
    const { text, content } = queue.shift() as JSONContent;
    if (text) {
      strs.push(text);
    }
    for (const item of content ?? []) {
      queue.push(item);
    }
  }
  return strs.join('');
}

const RichTextEditorComponent: FC<RichTextEditorProps> = ({ editorProps }) => {
  const editor = useEditor(editorProps);

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export { RichTextEditorComponent as RichTextEditor };
