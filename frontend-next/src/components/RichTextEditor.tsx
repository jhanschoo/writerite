import { RichTextEditor, Link } from '@mantine/tiptap';
import { Editor, EditorContent, EditorOptions, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import Placeholder from '@tiptap/extension-placeholder';

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

export interface EditorAndViewerFactoryProps {
  editorComponent: (props: RichTextEditorProps) => JSX.Element;
  content: JSONContent | null;
  setContent: (content: JSONContent) => void;
  placeholder?: string;
}

/**
 * 
 * @param editorComponent the component to use for the editor
 * @param content a field describing the content of the editor and viewer. If this field changes except through this editor, only the viewer will update; to update the editor, use `resetEditorContent`
 * @param setContent a function to set value of the content field passed in
 * @returns [editor, viewer, resetEditorContent] where `editor` is the editor component, `viewer` is the viewer component, and `resetEditorContent` is a function to reset the editor content to the value in the viewer, which should be the value of `content`
 */
export const EditorAndViewerFactory = ({
  editorComponent: EditorComponent,
  content,
  setContent,
  placeholder,
}: EditorAndViewerFactoryProps): [JSX.Element, JSX.Element, () => void] => {
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    extensions: [
      ...(DEFAULT_EDITOR_PROPS.extensions || []),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      const updatedJsonContent = editor.getJSON();
      setContent(updatedJsonContent);
    },
  });
  useEffect(() => {
    editor?.commands.setContent(content);
  }, []);
  const viewer = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    editable: false,
    extensions: [...(DEFAULT_EDITOR_PROPS.extensions || [])],
    content,
  });
  viewer?.commands.setContent(content);
  return [<EditorComponent editor={editor} />, <EditorContent editor={viewer} />, () => editor?.commands.setContent(viewer?.getJSON() ?? null)];
};

export const BareRichTextEditor = ({ editor }: RichTextEditorProps) => {
  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export const ToolbaredRichTextEditor = ({ editor }: RichTextEditorProps) => {
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
