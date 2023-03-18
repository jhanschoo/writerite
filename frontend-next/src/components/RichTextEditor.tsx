import { RichTextEditor, Link } from '@mantine/tiptap';
import type { Editor, EditorOptions, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { FC } from 'react';

export const DEFAULT_EDITOR_PROPS: Partial<EditorOptions> = {
  extensions: [StarterKit, Underline, Link],
};

export interface RichTextEditorProps {
  editor: Editor | null;
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

export const BareRichTextEditor: FC<RichTextEditorProps> = ({ editor }) => {
  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export const ToolbaredRichTextEditor: FC<RichTextEditorProps> = ({ editor }) => {
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
